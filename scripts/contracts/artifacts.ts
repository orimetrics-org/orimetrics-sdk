import type { JsonObject } from "@contracts/values";

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { astToString } from "openapi-typescript";
import { format } from "oxfmt";
import { PUBLIC_OPERATIONS } from "@contracts/policy";
import { projectPublicContract } from "@contracts/projection";
import { objectValue, stringValue } from "@contracts/values";

import openapiTS from "openapi-typescript";

export interface SourceIdentity {
  readonly packageName: string;
  readonly version: string;
  readonly openapiSha256: string;
}

export interface ContractArtifacts {
  readonly openapi: string;
  readonly types: string;
  readonly manifest: string;
}

export const sha256 = (content: string): string =>
  createHash("sha256").update(content).digest("hex");

export const readObject = async (path: string): Promise<JsonObject> => {
  const input: unknown = JSON.parse(await readFile(path, "utf8"));

  return objectValue(input, path);
};

export const formatArtifact = async (name: string, content: string): Promise<string> => {
  const result = await format(name, content, { printWidth: 100, tabWidth: 2 });

  if (result.errors.length > 0) {
    throw new Error(
      `Cannot format ${name}: ${result.errors.map((error) => error.message).join(", ")}`,
    );
  }

  return result.code;
};

export const readSourceIdentity = (input: unknown): SourceIdentity => {
  const source = objectValue(input, "source identity");
  const identity = {
    packageName: stringValue(source.packageName, "source package name"),
    version: stringValue(source.version, "source version"),
    openapiSha256: stringValue(source.openapiSha256, "source SHA-256"),
  };

  if (
    identity.packageName !== "@orimetrics/api-contract" ||
    !/^[a-f0-9]{64}$/u.test(identity.openapiSha256)
  ) {
    throw new Error("Invalid source package identity or SHA-256.");
  }

  return identity;
};

export const loadSource = async (
  directory: string,
): Promise<{ document: JsonObject; source: SourceIdentity }> => {
  const raw = await readFile(join(directory, "openapi.json"), "utf8");
  const document = objectValue(JSON.parse(raw), "source OpenAPI");
  const metadata = await readObject(join(directory, "manifest.json"));
  const packageMetadata = await readObject(join(directory, "package.json"));
  const hashes = objectValue(metadata.sha256, "source manifest hashes");
  const info = objectValue(document.info, "source OpenAPI info");
  const source = readSourceIdentity({
    packageName: packageMetadata.name,
    version: packageMetadata.version,
    openapiSha256: sha256(raw),
  });

  if (hashes["openapi.json"] !== source.openapiSha256) {
    throw new Error(
      "Source OpenAPI does not match its Engine manifest. Regenerate or restore the source contract.",
    );
  }

  if (info.version !== source.version || metadata.version !== source.version) {
    throw new Error("Source package, manifest and OpenAPI versions disagree.");
  }

  return { document, source };
};

const toolVersion = async (root: string, name: string): Promise<string> => {
  const packageMetadata = await readObject(join(root, "package.json"));
  const dependencies = objectValue(packageMetadata.devDependencies, "development dependencies");
  const installed = await readObject(join(root, "node_modules", name, "package.json"));
  const version = stringValue(installed.version, `${name} version`);

  if (dependencies[name] !== version) {
    throw new Error(
      `${name} must be installed at its exact package.json version. Run bun install --frozen-lockfile.`,
    );
  }

  return version;
};

export const createArtifacts = async (
  root: string,
  document: JsonObject,
  source: SourceIdentity,
): Promise<ContractArtifacts> => {
  const projection = projectPublicContract(document);
  const info = objectValue(projection.info, "projected info");

  if (info.version !== source.version) {
    throw new Error("Public snapshot and source identity versions disagree.");
  }

  const openapi = await formatArtifact("openapi.json", JSON.stringify(projection, null, 2));
  const nodes = await openapiTS(openapi, { alphabetize: true });
  const types = await formatArtifact(
    "schema.ts",
    `/** Generated from contracts/openapi.json. Do not edit; run bun run contracts:generate. */\n${astToString(nodes)}`,
  );
  const manifest = await formatArtifact(
    "manifest.json",
    JSON.stringify(
      {
        formatVersion: 1,
        source,
        policySha256: sha256(JSON.stringify(PUBLIC_OPERATIONS)),
        generators: {
          "openapi-typescript": await toolVersion(root, "openapi-typescript"),
          oxfmt: await toolVersion(root, "oxfmt"),
          typescript: await toolVersion(root, "typescript"),
        },
        sha256: { "openapi.json": sha256(openapi), "schema.ts": sha256(types) },
      },
      null,
      2,
    ),
  );

  return { openapi, types, manifest };
};

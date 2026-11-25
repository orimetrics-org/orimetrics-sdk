import type { ContractArtifacts } from "@contracts/artifacts";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_OPERATIONS } from "@contracts/policy";
import { objectValue } from "@contracts/values";

import * as a from "@contracts/artifacts";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const OPENAPI_PATH = join(ROOT, "contracts/openapi.json");
const MANIFEST_PATH = join(ROOT, "contracts/manifest.json");
const TYPES_PATH = join(ROOT, "src/shared/api/generated/schema.ts");

const loadPinned = async (): Promise<ContractArtifacts> => {
  const raw = await readFile(OPENAPI_PATH, "utf8");
  const manifest = await a.readObject(MANIFEST_PATH);
  const hashes = objectValue(manifest.sha256, "snapshot hashes");

  if (manifest.formatVersion !== 1 || hashes["openapi.json"] !== a.sha256(raw)) {
    throw new Error(
      "Public snapshot integrity mismatch. Use contracts:update with a verified source contract.",
    );
  }

  if (manifest.policySha256 !== a.sha256(JSON.stringify(PUBLIC_OPERATIONS))) {
    throw new Error(
      "Public operation policy changed. Run contracts:update against the reviewed source.",
    );
  }

  const document = objectValue(JSON.parse(raw), "public OpenAPI");
  const artifacts = await a.createArtifacts(ROOT, document, a.readSourceIdentity(manifest.source));

  if (artifacts.openapi !== raw) {
    throw new Error(
      "Snapshot contains unsupported operations, unused schemas or noncanonical metadata. Run contracts:update.",
    );
  }

  return artifacts;
};

const compareArtifacts = async (
  artifacts: ContractArtifacts,
  recovery = "contracts:generate",
): Promise<void> => {
  const expected = [
    [OPENAPI_PATH, artifacts.openapi],
    [MANIFEST_PATH, artifacts.manifest],
    [TYPES_PATH, artifacts.types],
  ] as const;

  for (const [path, content] of expected) {
    if ((await readFile(path, "utf8")) !== content) {
      throw new Error(`Contract drift: ${path}. Run ${recovery} and review the changes.`);
    }
  }
};

const writeArtifacts = async (artifacts: ContractArtifacts): Promise<void> => {
  await mkdir(dirname(TYPES_PATH), { recursive: true });
  await mkdir(dirname(OPENAPI_PATH), { recursive: true });
  await writeFile(OPENAPI_PATH, artifacts.openapi);
  await writeFile(TYPES_PATH, artifacts.types);
  await writeFile(MANIFEST_PATH, artifacts.manifest);
};

const main = async (): Promise<void> => {
  const [command, flag, sourcePath, ...extra] = process.argv.slice(2);
  const hasSource = flag === "--source" && typeof sourcePath === "string";

  if (
    !["update", "generate", "check"].includes(command ?? "") ||
    extra.length > 0 ||
    (flag !== undefined && !hasSource) ||
    (command === "update" && !hasSource) ||
    (command === "generate" && flag !== undefined)
  ) {
    throw new Error(
      "Usage: contracts:update --source <Engine contract directory> | contracts:generate | contracts:check [--source <directory>]",
    );
  }

  if (command === "update" && sourcePath) {
    const { document, source } = await a.loadSource(resolve(sourcePath));
    const artifacts = await a.createArtifacts(ROOT, document, source);

    await writeArtifacts(artifacts);
    console.log(
      `Imported ${PUBLIC_OPERATIONS.length} public operations from Engine contract ${source.version}.`,
    );

    return;
  }

  const artifacts = await loadPinned();

  if (command === "generate") {
    await writeArtifacts(artifacts);
    console.log("Generated public transport types from the pinned snapshot.");

    return;
  }

  await compareArtifacts(artifacts);

  if (sourcePath) {
    const { document, source } = await a.loadSource(resolve(sourcePath));

    await compareArtifacts(
      await a.createArtifacts(ROOT, document, source),
      "contracts:update --source <directory>",
    );
  }

  console.log("Public contract, provenance and generated types are up to date.");
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : "Contract generation failed.");
  process.exitCode = 1;
}

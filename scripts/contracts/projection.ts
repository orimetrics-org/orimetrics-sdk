import type { PublicOperation } from "@contracts/policy";
import type { JsonObject } from "@contracts/values";

import { PUBLIC_OPERATIONS } from "@contracts/policy";
import { objectValue, stringValue } from "@contracts/values";

const SCHEMA_PREFIX = "#/components/schemas/" as const;

const collectReferences = (value: unknown, names: Set<string>): void => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectReferences(item, names));

    return;
  }

  if (typeof value !== "object" || value === null) {
    return;
  }

  const object = objectValue(value, "reference owner");

  if ("$ref" in object) {
    const reference = stringValue(object.$ref, "$ref");
    const name = reference.slice(SCHEMA_PREFIX.length);

    if (!reference.startsWith(SCHEMA_PREFIX) || !name || /[/~%]/u.test(name)) {
      throw new Error(
        `Unsupported reference: ${reference}. Only local named schemas are supported.`,
      );
    }

    names.add(name);
  }

  if ("discriminator" in object) {
    throw new Error("Discriminator mappings require explicit projection support before import.");
  }

  Object.values(object).forEach((item) => collectReferences(item, names));
};

const selectSchemas = (paths: JsonObject, sourceSchemas: JsonObject): JsonObject => {
  const names = new Set<string>();
  const selected: JsonObject = {};

  collectReferences(paths, names);

  for (const name of names) {
    if (!Object.hasOwn(sourceSchemas, name)) {
      throw new Error(`Unresolved schema reference: ${name}`);
    }

    const schema = objectValue(sourceSchemas[name], `schema ${name}`);

    selected[name] = schema;
    collectReferences(schema, names);
  }

  return Object.fromEntries(
    Object.keys(selected)
      .sort()
      .map((name) => [name, selected[name]]),
  );
};

const selectOperation = (pathItem: JsonObject, method: string, path: string): JsonObject => {
  const operation = objectValue(pathItem[method], `${method.toUpperCase()} ${path}`);

  if (!Array.isArray(operation.security) || operation.security.length !== 0) {
    throw new Error(`Operation must explicitly omit session authentication: ${method} ${path}`);
  }

  if (operation.callbacks || operation.servers || pathItem.parameters || pathItem.$ref) {
    throw new Error(`Unsupported operation composition: ${method} ${path}`);
  }

  objectValue(operation.responses, `responses for ${method} ${path}`);
  stringValue(operation.operationId, `operationId for ${method} ${path}`);

  const selected = { ...operation };

  delete selected.externalDocs;
  selected.description =
    "Public SDK transport contract. See contracts/README.md for workflow semantics.";

  return selected;
};

export const projectPublicContract = (
  input: unknown,
  operations: readonly PublicOperation[] = PUBLIC_OPERATIONS,
): JsonObject => {
  const source = objectValue(input, "OpenAPI document");
  const info = objectValue(source.info, "OpenAPI info");
  const sourcePaths = objectValue(source.paths, "OpenAPI paths");
  const components = objectValue(source.components, "OpenAPI components");
  const sourceSchemas = objectValue(components.schemas, "OpenAPI schemas");
  const paths: Record<string, JsonObject> = {};
  const ids = new Set<string>();

  if (source.openapi !== "3.1.0") {
    throw new Error("Expected Engine's OpenAPI 3.1.0 contract.");
  }

  for (const { method, path } of operations) {
    if (!path.startsWith("/public/")) {
      throw new Error(`Non-public path in policy: ${path}`);
    }

    const pathItem = objectValue(sourcePaths[path], `path ${path}`);
    const operation = selectOperation(pathItem, method, path);
    const operationId = stringValue(operation.operationId, "operationId");

    if (ids.has(operationId) || paths[path]?.[method]) {
      throw new Error(`Duplicate public operation: ${method} ${path}`);
    }

    ids.add(operationId);
    paths[path] ??= {};
    paths[path][method] = operation;
  }

  const sortedPaths = Object.fromEntries(
    Object.keys(paths)
      .sort()
      .map((path) => [path, paths[path]]),
  );

  return {
    openapi: "3.1.0",
    info: {
      title: "Orimetrics public SDK API",
      version: stringValue(info.version, "source version"),
      description:
        "Explicitly selected public operations from the versioned Engine contract. No deployment URL or ERP session credentials are included.",
    },
    paths: sortedPaths,
    components: { schemas: selectSchemas(sortedPaths, sourceSchemas) },
  };
};

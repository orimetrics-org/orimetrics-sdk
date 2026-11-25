import type { JsonObject } from "@contracts/values";

import { expect, test } from "bun:test";
import { projectPublicContract } from "@contracts/projection";
import { objectValue } from "@contracts/values";

const POLICY = [{ method: "get", path: "/public/example" }] as const;

const fixture = () => ({
  openapi: "3.1.0",
  info: { version: "1.2.3", title: "Internal API" },
  servers: [{ url: "https://internal.example.test" }],
  security: [{ session: [] }],
  paths: {
    "/public/example": {
      get: {
        operationId: "get_example",
        security: [],
        externalDocs: { url: "guides/private.md" },
        responses: {
          "200": {
            description: "Success",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Listing" } } },
          },
        },
      },
      post: { operationId: "unexpected_write", security: [] },
    },
    "/public/new-endpoint": { get: { operationId: "new_public_endpoint", security: [] } },
    "/private/customers": {
      get: { operationId: "private_customers", security: [{ session: [] }] },
    },
  },
  components: {
    securitySchemes: { session: { type: "apiKey", in: "cookie", name: "session" } },
    schemas: {
      Listing: { type: "object", properties: { image: { $ref: "#/components/schemas/Image" } } },
      Image: { type: "object", properties: { listing: { $ref: "#/components/schemas/Listing" } } },
      PrivateCustomer: { type: "object", properties: { secret: { type: "string" } } },
    },
  },
});

test("selects exact methods and paths, prunes private metadata, and keeps cyclic reachable schemas", () => {
  const source = fixture();
  const original = structuredClone(source);
  const projected = projectPublicContract(source, POLICY);
  const paths = objectValue(projected.paths, "paths");
  const path = objectValue(paths["/public/example"], "path");
  const components = objectValue(projected.components, "components");

  expect(Object.keys(paths)).toEqual(["/public/example"]);
  expect(Object.keys(path)).toEqual(["get"]);
  expect(Object.keys(objectValue(components.schemas, "schemas"))).toEqual(["Image", "Listing"]);
  expect(projected.servers).toBeUndefined();
  expect(projected.security).toBeUndefined();
  expect(components.securitySchemes).toBeUndefined();
  expect(objectValue(path.get, "get").externalDocs).toBeUndefined();
  expect(source).toEqual(original);
  expect(projectPublicContract(projected, POLICY)).toEqual(projected);
});

test("rejects authenticated operations and inherited authentication", () => {
  const source = fixture();
  const operation: JsonObject = source.paths["/public/example"].get;

  operation.security = [{ session: [] }];
  expect(() => projectPublicContract(source, POLICY)).toThrow("session authentication");
  delete operation.security;
  expect(() => projectPublicContract(source, POLICY)).toThrow("session authentication");
});

test("rejects missing operations and non-public policy paths", () => {
  expect(() =>
    projectPublicContract(fixture(), [{ method: "get", path: "/public/missing" }]),
  ).toThrow();
  expect(() =>
    projectPublicContract(fixture(), [{ method: "get", path: "/private/customers" }]),
  ).toThrow("Non-public path");
});

test.each(["#/components/schemas/Missing", "https://example.test/schema.json", "#/paths/private"])(
  "rejects unresolved or unsupported references: %s",
  (reference) => {
    const source = fixture();

    source.components.schemas.Listing.properties.image.$ref = reference;
    expect(() => projectPublicContract(source, POLICY)).toThrow();
  },
);

test("fails rather than dropping path-level parameter composition", () => {
  const source = fixture();
  const path: JsonObject = source.paths["/public/example"];

  path.parameters = [{ name: "required", in: "query", required: true }];
  expect(() => projectPublicContract(source, POLICY)).toThrow("Unsupported operation composition");
});

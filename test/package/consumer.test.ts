import { afterAll, beforeAll, expect, test } from "bun:test";
import { mkdtemp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const repositoryRoot = process.cwd();

let consumerDirectory: string;
let installedPackage: string;

const runCommand = (command: string[], cwd: string): void => {
  const result = Bun.spawnSync(command, { cwd, stdout: "pipe", stderr: "pipe" });

  if (result.exitCode !== 0) {
    throw new Error(`${command.join(" ")}\n${result.stdout}\n${result.stderr}`);
  }
};

beforeAll(async () => {
  consumerDirectory = await mkdtemp(join(tmpdir(), "orimetrics-sdk-consumer-"));
  installedPackage = join(consumerDirectory, "node_modules/@orimetrics/sdk");
  await mkdir(installedPackage, { recursive: true });
  runCommand(
    [process.execPath, "pm", "pack", "--ignore-scripts", "--destination", consumerDirectory],
    repositoryRoot,
  );

  const archives = (await readdir(consumerDirectory)).filter((name) => name.endsWith(".tgz"));
  const archive = archives[0];

  if (archives.length !== 1 || !archive) {
    throw new Error("Expected exactly one package archive.");
  }

  runCommand(
    [
      "tar",
      "-xzf",
      join(consumerDirectory, archive),
      "--strip-components=1",
      "-C",
      installedPackage,
    ],
    repositoryRoot,
  );
  await writeFile(
    join(consumerDirectory, "package.json"),
    JSON.stringify({
      type: "module",
      private: true,
      dependencies: { "@orimetrics/sdk": `file:./${archive}` },
    }),
  );
  runCommand([process.execPath, "install", "--offline", "--ignore-scripts"], consumerDirectory);
});

afterAll(async () => {
  if (consumerDirectory) {
    await rm(consumerDirectory, { recursive: true, force: true });
  }
});

test("ships only the declared distribution and package documentation", async () => {
  const files = await readdir(installedPackage);

  expect(files.filter((file) => file !== ".bun-tag").sort()).toEqual([
    "README.md",
    "dist",
    "package.json",
  ]);
  expect(await Bun.file(join(installedPackage, "dist/index.js")).exists()).toBe(true);
  expect(await Bun.file(join(installedPackage, "dist/index.d.ts")).exists()).toBe(true);
});

test("declarations resolve without repository aliases or Bun ambient types", async () => {
  await writeFile(
    join(consumerDirectory, "consumer.ts"),
    `import type { OrimetricsOptions, OrganizationProfile } from "@orimetrics/sdk";
import { createOrimetricsClient, OrimetricsError } from "@orimetrics/sdk";
const options: OrimetricsOptions = {
  baseUrl: "https://api.example.test",
  organizationSlug: "example",
  fetch: globalThis.fetch,
};
// @ts-expect-error organizationSlug is required.
const incomplete: OrimetricsOptions = { baseUrl: "https://api.example.test" };
// @ts-expect-error a transport must be a fetch-compatible function.
const invalidFetch: OrimetricsOptions = { ...options, fetch: "invalid" };
const client = createOrimetricsClient(options);
const profile: Promise<OrganizationProfile> = client.organization.getProfile({ timeoutMs: 5000 });
// @ts-expect-error There is no arbitrary-route API.
client.GET("/private");
const error = new OrimetricsError({ kind: "network" });
void [options, incomplete, invalidFetch, profile, error];
`,
  );
  await writeFile(
    join(consumerDirectory, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: [],
        lib: ["ES2022", "DOM", "DOM.Iterable"],
      },
      files: ["consumer.ts"],
    }),
  );
  runCommand(
    [join(repositoryRoot, "node_modules/.bin/tsc"), "-p", "tsconfig.json"],
    consumerDirectory,
  );
});

test("ESM entry bundles for a browser without source aliases", async () => {
  const entry = join(consumerDirectory, "consumer.js");

  await writeFile(
    entry,
    `import { createOrimetricsClient, OrimetricsError } from "@orimetrics/sdk";
let calls = 0;
const client = createOrimetricsClient({ baseUrl: "https://example.test", organizationSlug: "demo", fetch: async (request, init) => {
  calls++;
  if (init.credentials !== "omit") throw new Error("Credentials leaked");
  return new Response("unavailable", { status: 503 });
} });
if (calls !== 0) throw new Error("Construction performed a request");
try { await client.organization.getProfile(); throw new Error("Expected failure"); }
catch (error) { if (!(error instanceof OrimetricsError) || error.kind !== "http" || error.status !== 503) throw error; }
if (calls !== 1) throw new Error("Unexpected retry");`,
  );

  const result = await Bun.build({ entrypoints: [entry], target: "browser", format: "esm" });

  expect(result.success).toBe(true);
  expect(result.logs).toHaveLength(0);
  runCommand([process.execPath, entry], consumerDirectory);
});

import { afterEach, expect, test } from "bun:test";
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadSource, sha256 } from "@contracts/artifacts";

const repositoryRoot = process.cwd();
const temporaryDirectories: string[] = [];

const createTemporaryDirectory = async (): Promise<string> => {
  const directory = await mkdtemp(join(tmpdir(), "orimetrics-contract-"));

  temporaryDirectories.push(directory);

  return directory;
};

const copyContractWorkspace = async (): Promise<string> => {
  const directory = await createTemporaryDirectory();

  for (const path of [
    "scripts",
    "contracts",
    "src",
    "package.json",
    "tsconfig.json",
    "tsconfig.tools.json",
  ]) {
    await cp(join(repositoryRoot, path), join(directory, path), { recursive: true });
  }

  await symlink(join(repositoryRoot, "node_modules"), join(directory, "node_modules"), "dir");

  return directory;
};

const runCheck = (directory: string) =>
  Bun.spawnSync(
    [
      process.execPath,
      "--no-env-file",
      "--tsconfig-override",
      "./tsconfig.tools.json",
      "scripts/contracts/cli.ts",
      "check",
    ],
    { cwd: directory, stdout: "pipe", stderr: "pipe" },
  );

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

test("checks a standalone checkout with no Engine checkout and leaves artifacts unchanged", async () => {
  const directory = await copyContractWorkspace();
  const typesPath = join(directory, "src/shared/api/generated/schema.ts");
  const before = await readFile(typesPath, "utf8");
  const result = runCheck(directory);

  expect(result.stderr.toString()).toBe("");
  expect(result.exitCode).toBe(0);
  expect(await readFile(typesPath, "utf8")).toBe(before);
});

test("detects edited generated types without repairing them in check mode", async () => {
  const directory = await copyContractWorkspace();
  const typesPath = join(directory, "src/shared/api/generated/schema.ts");
  const edited = `${await readFile(typesPath, "utf8")}\n// unexpected edit\n`;

  await writeFile(typesPath, edited);

  const result = runCheck(directory);

  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain("Contract drift");
  expect(await readFile(typesPath, "utf8")).toBe(edited);
});

test("detects edited snapshot bytes before regenerating", async () => {
  const directory = await copyContractWorkspace();
  const path = join(directory, "contracts/openapi.json");
  const edited = `${await readFile(path, "utf8")}\n`;

  await writeFile(path, edited);

  const result = runCheck(directory);

  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain("integrity mismatch");
  expect(await readFile(path, "utf8")).toBe(edited);
});

test("verifies upstream bytes and package version before import", async () => {
  const directory = await createTemporaryDirectory();
  const document = JSON.stringify({ info: { version: "1.2.3" } });
  const packagePath = join(directory, "package.json");

  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "openapi.json"), document);
  await writeFile(
    packagePath,
    JSON.stringify({ name: "@orimetrics/api-contract", version: "1.2.3" }),
  );
  await writeFile(
    join(directory, "manifest.json"),
    JSON.stringify({ version: "1.2.3", sha256: { "openapi.json": sha256(document) } }),
  );

  expect((await loadSource(directory)).source.version).toBe("1.2.3");
  await writeFile(
    packagePath,
    JSON.stringify({ name: "@orimetrics/api-contract", version: "2.0.0" }),
  );
  await expect(loadSource(directory)).rejects.toThrow("versions disagree");
  await writeFile(join(directory, "openapi.json"), `${document}\n`);
  await expect(loadSource(directory)).rejects.toThrow("does not match");
});

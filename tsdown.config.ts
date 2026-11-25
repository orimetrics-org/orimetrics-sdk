import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "browser",
  target: "es2022",
  dts: { generator: "oxc" },
  clean: true,
  sourcemap: true,
  publint: true,
});

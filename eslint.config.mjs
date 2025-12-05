import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  { files: ["src/**/*.js"], languageOptions: { globals: globals.browser } },
  { files: ["src/**/*.js"], plugins: { js }, extends: ["js/recommended"] },
  { ignores: ["build/**/*"] },
]);

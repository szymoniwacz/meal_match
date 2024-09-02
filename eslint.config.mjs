import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";
import pluginJest from "eslint-plugin-jest";

// Configuration for JavaScript and JSX files
const jsConfig = {
  files: ["**/*.{js,mjs,cjs,jsx}"],
  languageOptions: {
    globals: {
      ...globals.browser,
      process: "readonly",
      module: "readonly",
      require: "readonly",
      __dirname: "readonly",
      global: "readonly",
      setImmediate: "readonly",
      // Jest globals
      describe: "readonly",
      it: "readonly",
      test: "readonly",
      expect: "readonly",
      jest: "readonly",
      beforeEach: "readonly",
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    parser: babelParser,
  },
  plugins: {
    react: pluginReact,
    jest: pluginJest,
  },
  rules: {
    ...pluginJs.configs.recommended.rules,
    ...pluginReact.configs.flat.recommended.rules,
    ...pluginJest.configs.recommended.rules,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

// Main ESLint configuration export
export default [
  jsConfig,
  {
    // Ignoring specific directories and files
    ignores: [
      "vendor/bundle/**",
      "public/packs/js/**",
      ".yarn/**"
    ],
  },
];

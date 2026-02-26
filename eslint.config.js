// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  [
    globalIgnores(["dist", "vite-env.d.ts"]),
    {
      files: ["**/*.{ts,tsx}"],
      ignores: ["vite-env.d.ts", "src/config/env.config.ts"],
      plugins: {
        prettier,
      },
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs["recommended-latest"],
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        ecmaVersion: 2020,
        // parser: tseslint.parser,
        // parserOptions: {
        //   sourceType: "module",
        //   ecmaVersion: 2020,
        // },
        globals: globals.browser,
      },
      rules: {
        "prettier/prettier": "warn",
        "spaced-comment": "warn",
        quotes: ["warn", "double"],
        "no-console": "warn",

        // Custom rule to prevent direct import.meta.env usage
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "MemberExpression[object.type='MetaProperty'][object.meta.name='import'][object.property.name='meta'][property.name='env']",
            message:
              "Direct usage of import.meta.env is not allowed. Please use the ENV config from '@/config' instead.",
          },
          {
            selector:
              "MemberExpression[object.object.type='MetaProperty'][object.object.meta.name='import'][object.object.property.name='meta'][object.property.name='env']",
            message:
              "Direct usage of import.meta.env is not allowed. Please use the ENV config from '@/config' instead.",
          },
        ],

        "no-restricted-imports": [
          "error",
          {
            name: "react-redux",
            importNames: ["useSelector", "useDispatch"],
            message: "Please use `@/hooks` instead.",
          },
          {
            name: ".",
            message: "Please use `./index` for imports.",
          },
          {
            name: "..",
            message: "Please use `../index` for imports.",
          },
        ],
      },
    },
  ],
  storybook.configs["flat/recommended"]
);

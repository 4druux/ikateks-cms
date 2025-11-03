import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    {
        files: ["resources/js/**/*.{js,mjs,cjs,ts,jsx,tsx}"],

        ignores: [
            "node_modules/**",
            "public/build/**",
            "bootstrap/cache/**",
            "storage/framework/**",
        ],

        plugins: {
            "@typescript-eslint": tseslint.plugin,
            react: pluginReact,
            "react-hooks": pluginReactHooks,
            import: pluginImport,
            "jsx-a11y": pluginJsxA11y,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                route: "readonly",
            },
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: "latest",
                sourceType: "module",
                project: true,
                tsconfigRootDir: __dirname,
            },
        },

        rules: {
            ...pluginJs.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...pluginReact.configs.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,
            ...pluginJsxA11y.configs.recommended.rules,

            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/no-children-prop": "warn",
            "react/no-unescaped-entities": "warn",
            "import/no-unresolved": "error",

            "no-unused-vars": "off",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },

        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.json",
                },
            },
        },
    },
];

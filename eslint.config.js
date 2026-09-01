import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // Possible Problems
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": "off",

            // Suggestions
            "prefer-const": "warn",
            "no-var": "error",
            "prefer-arrow-callback": "warn",
            "prefer-template": "warn",
        },
    },
    // Prettier config must be last to override conflicting rules
    prettierConfig,
    {
        ignores: [
            "node_modules/",
            "temp/",
            "build/",
            "*.min.js",
        ],
    },
];

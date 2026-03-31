import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import reactCompiler from "eslint-plugin-react-compiler";
import localRules from "eslint-plugin-local-rules";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import parser from "./eslint-local-rules/parser.js";

// Extract plugin instances from next's config to avoid
// "Cannot redefine plugin" errors in flat config.
function getNextPlugin(name) {
    return nextCoreWebVitals.find((c) => c.plugins?.[name])?.plugins[name];
}
const tsPlugin = getNextPlugin("@typescript-eslint");
const reactHooksPlugin = getNextPlugin("react-hooks");

export default [
    {
        ignores: [
            "**/scripts",
            "**/plugins",
            "**/next.config.js",
            "**/.claude/",
            "**/worker-bundle.dist.js",
        ],
    },
    ...nextCoreWebVitals,
    {
        plugins: {
            "@typescript-eslint": tsPlugin,
            "react-hooks": reactHooksPlugin,
            "react-compiler": reactCompiler,
            "local-rules": localRules,
        },

        languageOptions: {
            globals: Object.fromEntries(
                Object.entries({
                    ...globals.node,
                    ...globals.commonjs,
                    ...globals.browser,
                }).map(([key, value]) => [key.trim(), value])
            ),

            parser: tsParser,
        },

        rules: {
            "no-unused-vars": "off",

            "@typescript-eslint/no-unused-vars": ["error", {
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            }],

            "react-hooks/exhaustive-deps": "error",

            "react/no-unknown-property": ["error", {
                ignore: ["meta"],
            }],

            // New rules in react-hooks plugin — pre-existing patterns need refactoring
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/refs": "warn",

            "react-compiler/react-compiler": "error",
            "local-rules/lint-markdown-code-blocks": "error",
        },
    },
    {
        files: ["src/content/**/*.md"],

        languageOptions: {
            parser: parser,
            ecmaVersion: 5,
            sourceType: "module",
        },

        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "react-hooks/exhaustive-deps": "off",
            "react/no-unknown-property": "off",
            "react-compiler/react-compiler": "off",
            "local-rules/lint-markdown-code-blocks": "error",
        },
    },
];

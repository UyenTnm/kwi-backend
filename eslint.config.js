import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: { ecmaVersion: "latest", sourceType: "module" },
        rules: {
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
        },
        linterOptions: { reportUnusedDisableDirectives: true }
    }
];

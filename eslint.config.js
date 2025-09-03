import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: 'JSXAttribute[name.name="href"][value.value="#"]',
          message: "Avoid using href='#'. Use proper navigation with Link or Button components."
        },
        {
          selector: 'JSXAttribute[name.name="href"][value.value="javascript:void(0)"]',
          message: "Avoid using href='javascript:void(0)'. Use Button component instead."
        },
        {
          selector: 'JSXAttribute[name.name="onClick"][value.expression.body.body.length=0]',
          message: "Empty onClick handlers are not allowed. Implement proper functionality or remove."
        }
      ],
    },
  }
);

# AGENTS.md

## Purpose
- This file guides agentic coding tools working in this repo.
- Keep guidance aligned with the current codebase conventions.

## Repo Snapshot
- Vite app using ES modules (`"type": "module"`).
- Main entry: `src/js/app/main.js`.
- Styles: `src/css/main.css` with `@import` chain.
- JS folders: `src/js/app`, `src/js/backend`, `src/js/frontend`, `src/js/processing`, `src/js/services`.
- Config: `config/configfile.js`, `config/defaultCAM.js`, `config/languages/*`.

## Install
- `npm install`

## Dev / Build / Preview
- `npm run dev` Start Vite dev server.
- `npm run build` Production build.
- `npm run build:jatos` Build in JATOS mode (injects `jatos.js`).
- `npm run preview` Preview a production build.

## Lint / Format
- No lint or format scripts are configured.
- If adding ESLint/Prettier, update scripts in `package.json` and document here.

## Tests
- No test runner is configured.
- Running a single test is not available yet.
- If introducing Vitest/Jest, document commands such as `npm run test -- <pattern>`.

## Import and Module Conventions
- Use ESM `import`/`export` everywhere.
- Keep explicit `.js` extensions in relative imports.
- Order imports as: side-effect (CSS), third-party, local modules.
- Prefer named exports and export lists at the end of the file.

## JavaScript Style
- Indentation is 4 spaces in JS files.
- Use double quotes for strings.
- End statements with semicolons.
- Use trailing commas in multi-line objects/arrays.
- Prefer `const` and `let`; avoid adding new `var` unless matching nearby style.
- Avoid broad refactors or reformatting unrelated lines.

## DOM / UI Patterns
- UI code uses direct DOM APIs and jQuery; follow existing patterns.
- `src/js/app/vendor.js` exposes `$`, `toastr`, `cytoscape`, `uuidv4`, `Base64`.
- When in modules, import vendors from `src/js/app/vendor.js` instead of globals.
- Some flows use `window.*` functions for HTML `onclick` handlers; preserve this pattern when extending.

## State and Data Flow
- Shared state lives in `src/js/app/store.js`.
- Use `updateUi`, `updateEnv`, `updateFlags`, etc., rather than ad-hoc mutations.
- When mutating CAM structures, follow existing `store.cam` patterns.

## Error Handling
- For `fetch`, check response status before `json()` where needed.
- Use early returns to stop invalid flows.
- For user-facing problems, show `toastr` warnings/success messages.
- For non-user errors, use `console.error` with context.

## Naming Conventions
- camelCase for variables and functions.
- PascalCase for classes or constructor-like functions.
- File names in `src/js/**` are lower camelCase; keep consistency in each folder.
- CSS classes are kebab-case; keep existing class naming in styles and markup.

## CSS Style
- CSS is plain files under `src/css` and `src/css/shared`.
- Keep existing spacing and indentation in each file.
- Shared variables are in `src/css/shared/variables.css`.
- Avoid global resets unless necessary; add styles near related sections.

## Config and Localization
- Default study settings live in `config/configfile.js`.
- When adding new config values, keep defaults and comments there.
- Language strings live in `config/languages/*`; avoid hardcoding user text.

## Build Behavior Notes
- Vite base is `./` for relative builds.
- `build:jatos` injects `jatos.js` into `index.html` via `vite.config.js`.
- Do not remove JATOS-related build behavior unless you update downstream usage.

## Dependency Management
- Use npm (package-lock present).
- When adding dependencies, update both `package.json` and `package-lock.json`.

## Cursor / Copilot Rules
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found.
- If any are added later, mirror their requirements here.

## Agent Workflow Tips
- Prefer small, localized changes over sweeping refactors.
- Keep behavior consistent; do not “fix” logic without a clear requirement.
- If you add scripts, tests, or linters, document them in this file.

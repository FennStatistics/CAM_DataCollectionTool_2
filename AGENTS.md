# AGENTS.md

## Purpose
- Guidance for agentic coding tools working in this repo.
- Keep instructions aligned with current codebase conventions and scripts.

## Repo Snapshot
- Vite app using ES modules (`"type": "module"`).
- Main entry: `src/js/app/main.js` loaded from `index.html`.
- Styles: `src/css/main.css` with a layered `@import` chain.
- JS folders: `src/js/app`, `src/js/backend`, `src/js/frontend`, `src/js/processing`, `src/js/services`.
- Config and language data in `config/`.

## Install
- `npm install`

## Dev / Build / Preview
- `npm run dev` Start Vite dev server.
- `npm run build` Production build.
- `npm run build:jatos` JATOS mode build (injects `jatos.js`).
- `npm run preview` Preview a production build.
- Use `npm` (package-lock present); avoid yarn/pnpm unless the repo adopts them.

## Lint / Format
- No lint or format scripts are configured.
- If adding ESLint/Prettier, update `package.json` scripts and document here.
- Match local formatting when editing; avoid reflowing unrelated code.

## Tests
- No test runner is configured.
- Running a single test is not available yet.
- If introducing Vitest/Jest, document full-suite and single-test commands
  (e.g. `npm run test -- <pattern>` or `npx vitest run <pattern>`).

## Entry Points and Assets
- HTML entry is `index.html` (contains dialogs and some inline styles).
- Vite entry script loads `src/js/app/main.js`.
- Public assets live under `public/` (e.g. `public/img/*`).
- Keep inline `onclick` handlers in HTML in sync with `window.*` functions.
- Avoid moving dialog markup out of `index.html` unless refactoring broadly.

## Folder Responsibilities
- `src/js/app` bootstraps the app, sets up vendors, and holds shared state.
- `src/js/backend` contains CAM data structures and core logic.
- `src/js/frontend` holds DOM event wiring, dialogs, and UI buttons.
- `src/js/processing` contains preprocessing and postprocessing utilities.
- `src/js/services` wraps external integrations (e.g. JATOS).

## Import and Module Conventions
- Use ESM `import`/`export` everywhere.
- Keep explicit `.js` extensions in relative imports.
- Order imports as: side-effect (CSS), third-party, local modules.
- Prefer named exports and export lists at the end of the file.
- Avoid adding path aliases; use relative paths like the existing code.
- `src/js/app/vendor.js` is the source of shared vendors; avoid importing
  vendors directly from packages in feature modules.

## JavaScript Style
- Indentation is 4 spaces in JS files.
- Use double quotes for strings.
- End statements with semicolons.
- Use trailing commas in multi-line objects/arrays.
- Prefer `const` and `let`; avoid adding new `var` unless matching nearby style.
- Avoid broad refactors or reformatting unrelated lines.
- When editing long functions, keep existing line breaks and wrapping.
- Maintain the current pattern of function declarations plus explicit exports.
- Add JSDoc only when it materially improves clarity for complex data shapes.

## Naming Conventions
- camelCase for variables and functions.
- PascalCase for classes or constructor-like functions.
- File names in `src/js/**` are lower camelCase; keep per-folder consistency.
- CSS classes are kebab-case; keep existing class naming in styles and markup.
- Avoid renaming IDs/classes used by HTML and CSS unless updating both.

## Types
- Codebase is JavaScript-only; no TypeScript setup is present.
- If adding TypeScript, introduce `tsconfig.json` and update Vite config/scripts.

## DOM / UI Patterns
- UI code uses direct DOM APIs and jQuery; follow existing patterns.
- `src/js/app/vendor.js` exposes `$`, `toastr`, `cytoscape`, `uuidv4`, `Base64`.
- When in modules, import vendors from `src/js/app/vendor.js` instead of globals.
- Some flows use `window.*` functions for HTML `onclick` handlers; preserve this.
- jQuery UI dialogs are used throughout; keep dialog IDs and init patterns stable.
- Prefer adding new buttons via modules under `src/js/frontend/buttons`.

## HTML / Markup
- `index.html` contains dialog containers used by jQuery UI; do not rename IDs
  without updating JS.
- Keep the `<script type="module" src="/src/js/app/main.js">` entry intact.
- Inline styles are present; keep them limited and avoid moving them unless needed.
- Keep accessibility attributes (e.g. `alt` text) when touching markup.

## State and Data Flow
- Shared state lives in `src/js/app/store.js`.
- Use `updateUi`, `updateEnv`, `updateFlags`, etc., rather than ad-hoc mutations.
- When mutating CAM structures, follow existing `store.cam` patterns.
- Avoid storing derived UI state outside `store.ui`.
- If adding new flags, keep defaults in `config/configfile.js`.

## Error Handling
- For `fetch`, check response status before `json()` where needed.
- Use early returns to stop invalid flows.
- For user-facing problems, show `toastr` warnings/success messages.
- For non-user errors, use `console.error` with context.
- When integrating with JATOS, fall back to the stub in non-JATOS builds.
- Prefer small, explicit `try`/`catch` blocks over wide error swallowing.

## URL Params / Study Features
- Feature flags and overrides are parsed in `src/js/processing/featureStudies(URLparams).js`.
- Use `URLSearchParams` and return `configOverrides`, `flagsOverrides`, `uiOverrides`.
- Keep URL param keys stable to avoid breaking study links.

## CSS Style
- CSS is plain files under `src/css` and `src/css/shared`.
- Keep existing spacing and indentation in each file.
- Shared variables are in `src/css/shared/variables.css`.
- Avoid global resets unless necessary; add styles near related sections.
- Keep `@import` ordering in `src/css/main.css` unless changing cascade on purpose.
- Follow existing usage of inline styles in `index.html` when needed.

## Config and Localization
- Default study settings live in `config/configfile.js`.
- When adding new config values, keep defaults and comments there.
- Language strings live in `config/languages/*`; avoid hardcoding user text.
- `store.language` is used for UI text in JS; prefer it over literals.
- Some existing HTML uses hardcoded text; new user-facing text should use language files.

## Build Behavior Notes
- Vite base is `./` for relative builds.
- `build:jatos` injects `jatos.js` into `index.html` via `vite.config.js`.
- Do not remove JATOS-related build behavior unless updating downstream usage.
- `import.meta.env.MODE` is used to detect JATOS builds.

## Dependency Management
- Use npm (package-lock present).
- When adding dependencies, update both `package.json` and `package-lock.json`.
- Prefer existing dependencies like `jquery`, `toastr`, and `cytoscape`.

## Logging
- Console logging is used for debugging and study flow visibility.
- Avoid removing existing logs unless asked; add contextual prefixes for new logs.

## Cursor / Copilot Rules
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found.
- If any are added later, mirror their requirements here.

## Agent Workflow Tips
- Prefer small, localized changes over sweeping refactors.
- Keep behavior consistent; do not “fix” logic without a clear requirement.
- If you add scripts, tests, or linters, document them in this file.
- If you add new modules, keep them within the existing folder structure.
- When touching networking code, consider both Supabase and JATOS flows.

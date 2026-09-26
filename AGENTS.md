# AGENTS.md

Instructions for AI coding agents working on this repository. Read at the start of every session; these conventions apply to all changes.

## Project overview

- Single-page personal portfolio site, live at https://ardhan.dev (root of a custom domain — keep `base: '/'` in `vite.config.ts`).
- Stack: React 19 + TypeScript (strict) · Vite 7 (`@vitejs/plugin-react-swc`) · Tailwind CSS v4 (`@tailwindcss/vite`) · ESLint 9 (flat config).
- Node.js: Vite 7 requires `^20.19.0 || >=22.12.0`. CI uses `node-version: lts/*`; verified locally on v22.19.0. There is no `.nvmrc` and no `engines` field.
- Deployed to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`, plus manual `workflow_dispatch` (`concurrency: pages`, `cancel-in-progress: true`). A merge to `main` is a production release.

## Commands

- Install dependencies: `npm ci`
- Dev server (HMR): `npm run dev`
- **Verification gate (run before finishing any task):** `npm run lint && npm run build`.
  - `npm run build` runs `tsc -b && vite build`. This is the only typecheck (`tsc` is configured with `noEmit`).
  - `tsc -b` only covers `src/` (via `tsconfig.app.json`) and `vite.config.ts` (via `tsconfig.node.json`). A new root-level `.ts` file is outside the typecheck graph.
- Lint: `npm run lint` (`eslint .`)
- Preview the production build: `npm run preview`
- There is no test framework installed. Do not invent test commands, and do not add a test framework without asking.
- There is no formatter configured either (no Prettier/Stylelint, no `format` script) — see the Formatting section.

## Definition of done

- `npm run lint` and `npm run build` both pass.
- Visual changes are verified in the browser via `npm run dev` before finishing.
- CI runs `npm ci` + `npm run build` only — it does **not** lint. Your local lint run is the only lint gate; never skip it.
- If a check fails before you make a change, report it as pre-existing instead of assuming your change caused it.

## Architecture

- `src/App.tsx` composes the page: `Header`, `Hero`, `Experience`, `Footer` (all in `src/components/`).
- Not every piece of content lives in `src/data.ts`: `index.html` holds the `<title>`, `<meta name="description">` (currently a placeholder), and the favicon reference. React mounts into `#root`.
- Page data is data-driven:
  - `src/data.ts` — real content (personal info, hero/about copy, experience entries).
  - `src/types.ts` — shared types (`Project`, `Experience`, `Certification`, `Contact`).
  - **Do not delete unused exports** in `src/types.ts` (`Project`, `Certification`, `Contact`) or `src/data.ts` (`aboutParagraphs`) — they are reserved for future sections, not dead code.
- **Staged but not yet rendered — do not delete:** `src/components/About.tsx` (consumes `aboutParagraphs` and `Section`), `src/components/Section.tsx` (shared section shell: `pt-40 pb-20` + `container mx-auto px-15`), and the currently unused `AwsIcon` / `JavaIcon` / `CodeIcon` in `src/icons.tsx`.
- Recipe for a new section:
  1. add or extend a type in `src/types.ts`
  2. add data in `src/data.ts`
  3. create a component in `src/components/` — wrap it in `<Section id="…" title="…">` and **reuse `src/components/Section.tsx`** (`Hero.tsx` and `Experience.tsx` predate it and duplicate that markup; don't copy the duplication)
  4. compose it in `src/App.tsx`
  5. **add its `id` to the `navigationLinks` array in `src/components/Header.tsx`** — this is what makes the nav reach it
- Navigation is in-page anchors with smooth scrolling (`Header.tsx` `scrollToSection`), not a router. Do not add a routing library without asking.
- Icons: hand-rolled inline SVG React components in `src/icons.tsx`. Do not add an icon library.
- Bundler-imported images live in `src/assets/`. The favicon is the exception: `src/public/favicon.ico`, referenced from `index.html` as `/src/public/favicon.ico` (Vite resolves and hashes it into `dist/assets/`). **There is no Vite `public/` directory at the repo root** — `/foo.txt` will not resolve to a public asset, and creating a root `public/` dir changes what ships, so ask first.

## Styling (Tailwind CSS v4 — important)

- Tailwind v4 is CSS-first: there is intentionally **no `tailwind.config.js`**. Do not scaffold one.
- `src/index.css` contains exactly one line: `@import "tailwindcss";`. **There are currently no custom theme tokens, no `@theme` block, and no `@apply` anywhere in the repo** — styling is stock Tailwind utilities only. If tokens are ever introduced, define them in an `@theme` block in `src/index.css` and document them here.
- v4 generates spacing dynamically, so steps like `px-15`, `pt-30`, and `my-15` are **valid and intentional**, not typos. Don't "correct" them to the nearest classic step.
- Content detection is automatic: it scans the project root and skips `.gitignore`'d and binary files. Code that is gitignored or lives outside the project root won't have its utilities emitted unless an `@source` directive is added.
- Style with Tailwind utility classes in JSX. Do not introduce CSS modules, CSS-in-JS, or new global stylesheets without asking.
- No path aliases are configured; use relative imports.

## TypeScript conventions

- Strict flags are on in `tsconfig.app.json` / `tsconfig.node.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`.
- Because of `verbatimModuleSyntax`, use `import type { ... }` for type-only imports (see `src/data.ts` for the pattern).
- Because of `erasableSyntaxOnly`, stay type-only: no `enum`, no `namespace`, no constructor parameter properties. Use union types or `as const` objects.
- `jsx: react-jsx`: never `import React` for JSX. (`Section.tsx` references `React.ReactNode` without importing it, resolved via `@types/react`'s global namespace — that's fine.)
- Function components only, default exports, PascalCase filenames (e.g. `src/components/ExperienceCard.tsx`). `src/icons.tsx` is the deliberate exception: named exports, one icon per component, optional `className` prop.
- ESLint parses every `**/*.{ts,tsx}` with `ecmaVersion: 2020` and `globals.browser` — including `vite.config.ts`, which therefore has no Node globals. Avoid post-ES2020 syntax in linted files unless the ESLint config is updated too.

## Formatting

- No formatter is configured and existing files are inconsistent (tabs in `src/data.ts` and parts of `src/components/Section.tsx`; double quotes in `src/**` vs single quotes in root config files; semicolons in most files but not `src/App.tsx` / `src/icons.tsx`). **Do not reformat code you aren't otherwise changing.**
- For new or edited files, follow the dominant style: 2-space indentation, double quotes under `src/**` (single quotes in root config files), semicolons matching the surrounding file, one default-exported component per file.
- Keep imports relative and extensionless inside `src/` (`../data`), as in the existing components. `main.tsx` uses `./App.tsx`; `allowImportingTsExtensions` is enabled.

## Git & deployment workflow

- Intended branch flow: feature branch → PR into `develop` → PR `develop` → `main`. In practice only `main` exists locally and past PRs (#1–#3) merged directly into `main`; ask before branching if unsure.
- **Never commit directly to `main`.** Only `main` deploys; merging into it releases to production.
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`) with a short imperative subject.
- `dist/` is build output — never edit or commit it (already gitignored). `README.md` is still the untouched Vite template and is not a source of truth.
- `base: '/'` in `vite.config.ts` is required by the current custom-domain, root-path deployment. There is no `CNAME` file in the repo (the custom domain lives in GitHub Pages settings). Do not change `base` or the deploy artifact path without asking — it takes the live site down.
- Keep `package-lock.json` committed and in sync: CI uses `npm ci`, which fails on lockfile drift. Never hand-edit it.

## Dependencies policy

- Keep dependencies minimal. Runtime currently: `react`, `react-dom`, `tailwindcss`, `@tailwindcss/vite` — Tailwind and its Vite plugin intentionally live in `dependencies`, not `devDependencies`; leave them there.
- Do not add packages without asking. Prefer platform APIs, React built-ins, and Tailwind utilities.

## Known issues (fix them if you touch that code — don't copy them)

- `src/components/Footer.tsx:3` is a stray bare `personalInfo` expression; it makes `npm run lint` fail right now.
- `src/components/Hero.tsx` renders the profile photo with no `alt` attribute.
- `src/components/Header.tsx:25` scrolls to section id `'home'`, which doesn't exist (the hero is `id="hero"`), so it silently falls back to scrolling to the top.
- External links in `Hero.tsx` / `ExperienceCard.tsx` correctly use `target="_blank"` + `rel="noopener noreferrer"` — keep that pattern.

## Maintenance

- When a change alters the conventions, dependencies, commands, or workflows described here, update this file in the same change so future sessions stay accurate.
- This file is currently untracked in git (`?? AGENTS.md`) — commit it so other agents and collaborators actually see it.

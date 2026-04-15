# Prompt Foundry

Prompt Foundry is an open source library of reusable markdown-based prompts, skills, and agents, packaged behind a small CLI so people can install exactly what they need with `npx`.

This repository currently contains two things:

- an npm CLI package at the repo root
- a React website in `website/` for GitHub Pages

## Current Status

What is already set up:

- root npm package named `prompt-foundry`
- CLI entrypoint at `bin/prompt-foundry.js`
- install/list/provider logic in `lib/`
- packaged markdown content in `content/`
- provider-aware install flow with picker support
- React website built with Vite in `website/`
- GitHub Pages workflow in `.github/workflows/deploy-pages.yml`

## Requirements

- Node.js `18+`
- npm
- a terminal for interactive CLI picker behavior

## Repository Layout

```text
bin/                 CLI entrypoint
lib/                 CLI logic
content/             packaged prompts, skills, and agents
website/             React website for GitHub Pages
.github/workflows/   Pages deployment workflow
```

## Quick Start

From the repo root:

```bash
npm install
npm run dev
```

That starts the website locally at:

```text
http://localhost:5173/
```

## Website Development

Primary files to edit:

- `website/src/App.jsx`
- `website/src/styles.css`

Root-level commands:

```bash
npm install
npm run dev
npm run build
```

What they do:

- `npm install` installs the workspace dependencies for the website
- `npm run dev` starts the local React dev server with hot reload
- `npm run build` creates the production build in `website/dist/`

If you want to run website commands directly:

```bash
npm run dev --workspace prompt-foundry-website
npm run build --workspace prompt-foundry-website
```

## CLI Development

Run the CLI locally without publishing:

```bash
node ./bin/prompt-foundry.js list all
node ./bin/prompt-foundry.js providers
node ./bin/prompt-foundry.js install skill repo-audit --provider claude
node ./bin/prompt-foundry.js install prompt feature-spec --provider copilot
```

Available root CLI check command:

```bash
npm run check
```

That currently runs:

```bash
node ./bin/prompt-foundry.js list all
```

## CLI Commands

Current command surface:

```bash
npx prompt-foundry list [all|prompt|skill|agent]
npx prompt-foundry providers
npx prompt-foundry install <prompt|skill|agent> <name>
npx prompt-foundry install <prompt|skill|agent> <name> --provider copilot
npx prompt-foundry install <prompt|skill|agent> <name> --provider claude
npx prompt-foundry install <prompt|skill|agent> <name> --provider codex
npx prompt-foundry install <prompt|skill|agent> <name> --dir ./custom-folder
npx prompt-foundry install <prompt|skill|agent> <name> --force
```

## Provider Picker Behavior

If the user runs an install command without `--provider` in a normal interactive terminal, the CLI shows a picker for:

- `GitHub Copilot`
- `Anthropic/Claude`
- `OpenAI/Codex`

If the CLI is running in a non-interactive environment, such as CI or a scripted shell, it requires `--provider` explicitly.

Supported provider values:

- `copilot`
- `claude`
- `codex`

Accepted aliases:

- `github`
- `github-copilot`
- `anthropic`
- `anthropic-claude`
- `openai`
- `openai-codex`

## Where Installs Go

By default, installs go into provider-specific folders inside the project where the command is run.

GitHub Copilot installs to:

```text
.github/prompt-foundry/
  prompts/
  skills/
  agents/
```

Anthropic/Claude installs to:

```text
.claude/prompt-foundry/
  prompts/
  skills/
  agents/
```

OpenAI/Codex installs to:

```text
.codex/prompt-foundry/
  prompts/
  skills/
  agents/
```

Examples:

```bash
npx prompt-foundry install skill repo-audit --provider claude
npx prompt-foundry install agent pr-review --provider codex
npx prompt-foundry install prompt feature-spec --provider copilot
```

You can override the destination with `--dir`:

```bash
npx prompt-foundry install skill repo-audit --dir ./.prompt-foundry
```

## Current Bundled Content

Prompts:

- `feature-spec`

Skills:

- `repo-audit`

Agents:

- `pr-review`

These live in:

- `content/prompts/`
- `content/skills/`
- `content/agents/`

## How To Test Locally

### Test the website

From the repo root:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/`.

To verify the production build:

```bash
npm run build
```

### Test the CLI directly

From the repo root:

```bash
node ./bin/prompt-foundry.js list all
node ./bin/prompt-foundry.js providers
node ./bin/prompt-foundry.js install skill repo-audit --provider claude
```

### Test the package before publishing

Dry-run the npm package contents:

```bash
npm pack --dry-run
```

Create an actual tarball:

```bash
npm pack
```

Link it globally on your machine for command testing:

```bash
npm link
prompt-foundry list all
prompt-foundry providers
prompt-foundry install skill repo-audit --provider copilot
```

## How `npx` Will Work Publicly

For public `npx prompt-foundry ...` usage, the root package must be published to npm.

Publish flow:

```bash
npm login
npm publish --access public
```

Important note:

- if `prompt-foundry` is already taken on npm, rename the package in `package.json`
- if you rename the package, also update the website copy and README examples

## Free Website Deployment With GitHub Pages

The website is designed to deploy for free with GitHub Pages.

Workflow file:

```text
.github/workflows/deploy-pages.yml
```

Deployment steps:

1. Push this repository to GitHub.
2. Open the repository settings.
3. Enable GitHub Pages.
4. Set the Pages source to GitHub Actions.
5. Push to `main`.
6. The workflow will install, build, and deploy `website/` automatically.

The site build output is:

```text
website/dist/
```

## Scripts

Root `package.json` scripts:

```bash
npm run dev
npm run build
npm run check
npm run website:install
npm run website:build
```

What they currently do:

- `dev`: runs the website workspace dev server
- `build`: builds the website workspace
- `check`: runs `node ./bin/prompt-foundry.js list all`
- `website:install`: installs the website workspace dependencies
- `website:build`: builds the website workspace

## Important Files

CLI:

- `package.json`
- `bin/prompt-foundry.js`
- `lib/cli.js`
- `lib/install.js`

Website:

- `website/package.json`
- `website/index.html`
- `website/src/App.jsx`
- `website/src/main.jsx`
- `website/src/styles.css`
- `website/vite.config.js`

Deployment:

- `.github/workflows/deploy-pages.yml`

Documentation:

- `README.md`

## Known State Tonight

This is the current working state of the project:

- website dev flow works from the repo root with `npm run dev`
- website production build works with `npm run build`
- CLI list/install/provider commands work locally
- provider-aware install routing is implemented
- provider picker is implemented for interactive terminal sessions
- GitHub Pages workflow is added
- npm package dry run worked earlier in local verification

## Good Next Steps Tomorrow

1. Add more bundled prompts, skills, and agents.
2. Decide whether each provider should map to a more native folder structure than `prompt-foundry/`.
3. Improve the website copy and visuals.
4. Publish the package to npm.
5. Push to GitHub and enable Pages.
6. Optionally add more CLI commands like `init`, `search`, or `doctor`.

## License

This repository uses the mixed-license model described in `LICENSE`.

- CLI/tooling code: MIT
- content library: MIT + Commons Clause

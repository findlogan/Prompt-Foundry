import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const VALID_TYPES = ["prompt", "skill", "agent"];
const TYPE_ALIASES = {
  prompts: "prompt",
  skills: "skill",
  agents: "agent"
};

const PROVIDERS = {
  copilot: {
    key: "copilot",
    label: "GitHub Copilot",
    rootDir: ".github/prompt-foundry"
  },
  claude: {
    key: "claude",
    label: "Anthropic/Claude",
    rootDir: ".claude/prompt-foundry"
  },
  codex: {
    key: "codex",
    label: "OpenAI/Codex",
    rootDir: ".codex/prompt-foundry"
  }
};

const PROVIDER_ALIASES = {
  github: "copilot",
  "github-copilot": "copilot",
  copilot: "copilot",
  claude: "claude",
  anthropic: "claude",
  "anthropic-claude": "claude",
  codex: "codex",
  openai: "codex",
  "openai-codex": "codex"
};

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, "..");
const contentRoot = path.join(repoRoot, "content");

export function printHelp(exitCode = 0) {
  const lines = [
    "Prompt Foundry CLI",
    "",
    "Usage:",
    "  npx prompt-foundry list [all|prompt|skill|agent]",
    "  npx prompt-foundry install <prompt|skill|agent> <name> [--provider copilot|claude|codex] [--dir path] [--force]",
    "  npx prompt-foundry providers",
    "",
    "Providers:",
    "  copilot  -> .github/prompt-foundry/...",
    "  claude   -> .claude/prompt-foundry/...",
    "  codex    -> .codex/prompt-foundry/...",
    "",
    "Examples:",
    "  npx prompt-foundry list skills",
    "  npx prompt-foundry install skill repo-audit",
    "  npx prompt-foundry install skill repo-audit --provider claude",
    "  npx prompt-foundry install prompt feature-spec --dir .prompt-foundry"
  ];

  const printer = exitCode === 0 ? console.log : console.error;
  printer(lines.join("\n"));

  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }
}

export function listProviders() {
  for (const provider of Object.values(PROVIDERS)) {
    console.log(`${provider.key}: ${provider.label} -> ${provider.rootDir}`);
  }
}

export async function listContent(typeInput) {
  const requestedType = normalizeListType(typeInput);

  for (const type of requestedType) {
    const names = await getNamesForType(type);
    console.log(`${pluralize(type)}:`);

    if (names.length === 0) {
      console.log("  (none)");
      continue;
    }

    for (const name of names) {
      console.log(`  - ${name}`);
    }
  }
}

export async function installContent(typeInput, name, options = {}) {
  const type = normalizeType(typeInput);

  if (!type || !name) {
    printHelp(1);
    return;
  }

  const sourcePath = path.join(contentRoot, `${pluralize(type)}`, `${name}.md`);

  try {
    await fs.access(sourcePath);
  } catch {
    console.error(`No ${type} named '${name}' was found.`);
    console.error("Run `npx prompt-foundry list all` to see available content.");
    process.exitCode = 1;
    return;
  }

  const provider = await resolveProvider(options.provider);
  if (!provider) {
    process.exitCode = 1;
    return;
  }

  const targetRoot = options.dir
    ? path.resolve(process.cwd(), options.dir)
    : path.resolve(process.cwd(), provider.rootDir);
  const destinationDir = path.join(targetRoot, pluralize(type));
  const destinationPath = path.join(destinationDir, `${name}.md`);

  await fs.mkdir(destinationDir, { recursive: true });

  if (!options.force) {
    try {
      await fs.access(destinationPath);
      console.error(`Refusing to overwrite existing file: ${destinationPath}`);
      console.error("Re-run with `--force` to replace it.");
      process.exitCode = 1;
      return;
    } catch {
      // File does not exist yet.
    }
  }

  await fs.copyFile(sourcePath, destinationPath);
  console.log(`Installed ${type} '${name}' for ${provider.label} to ${destinationPath}`);
}

async function resolveProvider(providerInput) {
  if (providerInput) {
    const provider = normalizeProvider(providerInput);
    if (!provider) {
      console.error(`Unknown provider: ${providerInput}`);
      console.error("Use one of: copilot, claude, codex");
      return null;
    }

    return provider;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error("No provider supplied and no interactive terminal is available.");
    console.error("Re-run with `--provider copilot`, `--provider claude`, or `--provider codex`.");
    return null;
  }

  return promptForProvider();
}

async function promptForProvider() {
  const providerList = Object.values(PROVIDERS);
  const promptLines = ["Select a target provider:"];

  for (const [index, provider] of providerList.entries()) {
    promptLines.push(`  ${index + 1}. ${provider.label}`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const answer = await rl.question(`${promptLines.join("\n")}\n> `);
    const selectedIndex = Number.parseInt(answer.trim(), 10) - 1;
    const selectedProvider = providerList[selectedIndex];

    if (!selectedProvider) {
      console.error("Invalid provider selection.");
      return null;
    }

    return selectedProvider;
  } finally {
    rl.close();
  }
}

async function getNamesForType(type) {
  const directoryPath = path.join(contentRoot, pluralize(type));

  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name.replace(/\.md$/u, ""))
      .sort();
  } catch {
    return [];
  }
}

function normalizeListType(typeInput = "all") {
  if (typeInput === "all") {
    return VALID_TYPES;
  }

  const normalized = normalizeType(typeInput);
  if (!normalized) {
    console.error(`Unknown content type: ${typeInput}`);
    process.exitCode = 1;
    return [];
  }

  return [normalized];
}

function normalizeType(typeInput) {
  if (!typeInput) {
    return null;
  }

  if (VALID_TYPES.includes(typeInput)) {
    return typeInput;
  }

  return TYPE_ALIASES[typeInput] ?? null;
}

function normalizeProvider(providerInput) {
  const normalizedKey = PROVIDER_ALIASES[String(providerInput).toLowerCase()];

  if (!normalizedKey) {
    return null;
  }

  return PROVIDERS[normalizedKey] ?? null;
}

function pluralize(type) {
  return `${type}s`;
}

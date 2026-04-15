import { installContent, listContent, listProviders, printHelp } from "./install.js";

export async function runCLI(argv) {
  const [command, type, name, ...rest] = argv;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "list") {
    await listContent(type ?? "all");
    return;
  }

  if (command === "install") {
    const options = parseOptions(rest);
    await installContent(type, name, options);
    return;
  }

  if (command === "providers") {
    listProviders();
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp(1);
}

function parseOptions(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (token === "--dir") {
      options.dir = args[index + 1];
      index += 1;
      continue;
    }

    if (token === "--force") {
      options.force = true;
      continue;
    }

    if (token === "--provider") {
      options.provider = args[index + 1];
      index += 1;
      continue;
    }
  }

  return options;
}

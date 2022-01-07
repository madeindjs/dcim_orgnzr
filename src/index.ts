#!/usr/bin/env node
import "reflect-metadata";
import { parse } from "ts-command-line-args";
import { container } from "./container";
import { ComputeMoveService } from "./services/compute-move";
import { RulesServices } from "./services/rules.service";
import { TYPES } from "./types";

interface Args {
  path?: string;
  dryRun?: boolean;
  pattern: string;
  help?: boolean;
}

export const args = parse<Args>(
  {
    path: { optional: true, defaultValue: process.cwd(), type: String, description: "Path where images are located" },
    dryRun: { type: Boolean, optional: true, description: "Not apply modifications" },
    pattern: { type: String, alias: "p", description: "Pattern" },
    help: { type: Boolean, optional: true, alias: "h", description: "Prints this usage guide" },
  },
  {
    helpArg: "help",
    headerContentSections: [
      { header: "Description", content: "Organize your picture library according to EXIF data." },
      // { header: "Pattern", content: "" },
    ],
    footerContentSections: container.get<RulesServices>(TYPES.RulesServices).rules.map((rule) => ({
      header: `Pattern: ${rule.id}`,
      content: `${rule.description}\n\n${rule.examples
        .map((example, index) => `Example ${index + 1}:\n- ${example.pattern}\n+ ${example.result}`)
        .join("\n\n")}`,
    })),
  }
);

async function main() {
  const generator = await container
    .get<ComputeMoveService>(TYPES.ComputeMoveService)
    .getMovesForDirectory(args.path as string, args.pattern, { dryRun: args.dryRun });

  // @ts-ignore
  for await (const move of generator) {
    console.log(`mv ${move.from}  ${move.to}`);
  }
}

main().catch(console.error);

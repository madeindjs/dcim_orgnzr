import "reflect-metadata";
import { ArgumentConfig, Content, ParseOptions, UsageGuideConfig } from "ts-command-line-args";
import { container } from "../container";
import { RuleExample } from "../rules/abstract.rule";
import { RulesServices } from "../services/rules.service";
import { TYPES } from "../types";

export interface Args {
  path?: string;
  dryRun?: boolean;
  pattern: string;
  help?: boolean;
}

export const argumentConfig: ArgumentConfig<Args> = {
  path: { optional: true, defaultValue: process.cwd(), type: String, description: "Path where images are located" },
  dryRun: { type: Boolean, optional: true, description: "Not apply modifications" },
  pattern: { type: String, alias: "p", description: "Pattern" },
  help: { type: Boolean, optional: true, alias: "h", description: "Prints this usage guide" },
};

function convertExampleAsMArkdownDiff(example: RuleExample): string {
  return `\`\`\`diff\n- ${example.pattern}\n+ ${example.result}\n\`\`\``;
}

const patternsSections: Content[] = container
  .get<RulesServices>(TYPES.RulesServices)
  .getRulesDescriptions()
  .map((description) => ({
    headerLevel: 3,
    header: description.id,
    content: [description.description, "", "Examples", ...description.examples.map(convertExampleAsMArkdownDiff)],
  }));

export const parseOptions: ParseOptions<Args> = {
  helpArg: "help",
  headerContentSections: [
    { header: "dcim-orgnzr", content: "Organize your picture library according to EXIF data.", headerLevel: 1 },
    { header: "Usage", content: "`dcim-orgnzr --path='./dcim' --pattern=''`", headerLevel: 2 },
    {
      header: "Setup",
      includeIn: "markdown",
      content: [
        "Install simply using NPM: `npm install dcim-orgnzr`.",
        "You can also clone this repository and build it yourself.",
      ],
    },
  ],
  footerContentSections: [{ header: "Patterns", headerLevel: 2 }, ...patternsSections],
};

export const usageGuideInfo: UsageGuideConfig<Args> = {
  arguments: argumentConfig,
  parseOptions,
};

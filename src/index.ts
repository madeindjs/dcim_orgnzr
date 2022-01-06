import "reflect-metadata";
import { container } from "./container";
import { ComputeMoveService } from "./services/compute-move";
import { RulesServices } from "./services/rules.service";
import { TYPES } from "./types";

const isHelpNeeded = process.argv.includes("--help") || process.argv.includes("-h");

if (isHelpNeeded) {
  printHelp();
  process.exit(0);
}

const pattern = process.argv[2];
const from = process.argv[3] ?? process.cwd();

if (pattern === undefined) {
  console.error("You must provide a pattern");
  process.exit(1);
}

container
  .get<ComputeMoveService>(TYPES.ComputeMoveService)
  .getMovesForDirectory(from, pattern)
  .then(console.log)
  .catch(console.error);

function printHelp() {
  console.log("dcm-orgnzr <pattern> <directory>");
  console.log();
  console.group("patterns");
  console.log();
  container.get<RulesServices>(TYPES.RulesServices).printExamples();
  console.groupEnd();
  console.log("\t");
}

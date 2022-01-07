import { readFileSync, writeFileSync } from "fs";
import "reflect-metadata";
import { container } from "./container";
import { RulesServices } from "./services/rules.service";
import { TYPES } from "./types";
import path = require("path");

const readmeFilepath = path.join(path.dirname(__dirname), "README.md");

const readmeContent = readFileSync(readmeFilepath).toString();

const newReadmeContent = readmeContent.replace(
  /<\!-- BEGIN: rules generated -->.*<\!-- END -->/s,
  container.get<RulesServices>(TYPES.RulesServices).getExamplesAsMarkdown()
);

writeFileSync(readmeFilepath, newReadmeContent);

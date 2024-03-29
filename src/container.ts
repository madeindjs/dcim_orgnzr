import { Container } from "inversify";
import "reflect-metadata";
import { containerRulesModule } from "./rules/container-rule";
import { ComputeMoveService } from "./services/compute-move";
import { ExifParserService } from "./services/exif-parser.service";
import { RulesServices } from "./services/rules.service";
import { TYPES } from "./types";

export const container = new Container();
container.bind(TYPES.ComputeMoveService).to(ComputeMoveService);
container.bind(TYPES.ExifParserService).to(ExifParserService);
container.load(containerRulesModule);
container.bind(TYPES.RulesServices).to(RulesServices);

import { Container } from "inversify";
import "reflect-metadata";
import { ComputeMoveService } from "./compute-move";
import { ConfigurationService } from "./configuration";
import { ExifParser } from "./exif-parser";
import { containerRulesModule } from "./rules/container-rule";
import { TYPES } from "./types";

export const container = new Container();
container.bind(TYPES.ConfigurationService).to(ConfigurationService);
container.bind(TYPES.ComputeMoveService).to(ComputeMoveService);
container.bind(TYPES.ExifParser).to(ExifParser);
container.load(containerRulesModule);

import { Container } from "inversify";
import "reflect-metadata";
import { ConfigurationService } from "./configuration";
import { ComputeMoveService } from "./organizer";
import { TYPES } from "./types";

export const container = new Container();
container.bind(TYPES.ConfigurationService).to(ConfigurationService);
container.bind(TYPES.ComputeMoveService).to(ComputeMoveService);

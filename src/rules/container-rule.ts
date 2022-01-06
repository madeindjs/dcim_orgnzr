import { ContainerModule } from "inversify";
import { TYPES } from "../types";
import { ExifCreatedDateRule } from "./exif-created-date.rule";

export const containerRulesModule = new ContainerModule((registry) => {
  registry(TYPES.ExifCreatedDateRule).to(ExifCreatedDateRule);
});

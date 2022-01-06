import { ContainerModule } from "inversify";
import { TYPES } from "../types";
import { ExifCreateDateRule } from "./exif-create-date.rule";
import { ExifDateTimeOriginalRule } from "./exif-date-time-original-date.rule";

export const containerRulesModule = new ContainerModule((registry) => {
  registry(TYPES.ExifCreatedDateRule).to(ExifCreateDateRule);
  registry(TYPES.ExifDateTimeOriginalRule).to(ExifDateTimeOriginalRule);
});

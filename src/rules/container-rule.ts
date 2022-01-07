import { ContainerModule } from "inversify";
import { TYPES } from "../types";
import { ExifCreateDateRule } from "./date/exif-create-date.rule";
import { ExifDateTimeOriginalRule } from "./date/exif-date-time-original-date.rule";
import { ExifExposureTimeRule } from "./text/exif-exposure-time.rule";

export const containerRulesModule = new ContainerModule((registry) => {
  registry(TYPES.ExifCreatedDateRule).to(ExifCreateDateRule);
  registry(TYPES.ExifDateTimeOriginalRule).to(ExifDateTimeOriginalRule);
  registry(TYPES.ExifExposureTimeRule).to(ExifExposureTimeRule);
});

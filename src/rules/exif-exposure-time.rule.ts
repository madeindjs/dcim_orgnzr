import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { injectable } from "inversify";
import { AbstractTextRule } from "./abstract-text.rule";
import { RuleExample } from "./abstract.rule";

dayjs.extend(customParseFormat);

@injectable()
export class ExifExposureTimeRule extends AbstractTextRule {
  public id: string = "exif.ExposureTime";
  public description: string = "Use EXIF exposure time number value.";
  public examples: RuleExample[] = [
    {
      pattern: `<${this.id}>`,
      result: "0.0001/test.jpg",
    },
  ];
  protected readonly regex = /<exif\.ExposureTime>/g;

  protected getProperty(exifData: any): string {
    return exifData.exif.ExposureTime;
  }
}

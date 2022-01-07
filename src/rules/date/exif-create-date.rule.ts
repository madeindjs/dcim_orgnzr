import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { injectable } from "inversify";
import { RuleExample } from "../abstract.rule";
import { AbstractDateRule } from "./abstract-date.rule";

dayjs.extend(customParseFormat);

@injectable()
export class ExifCreateDateRule extends AbstractDateRule {
  public id: string = "exif.CreateDate";
  public description: string = "Use EXIF created date and format date according to given format";
  public examples: RuleExample[] = [
    {
      pattern: `<${this.id}:YYYY-MM-DD>`,
      result: "2021-02-03/test.jpg",
    },
    {
      pattern: `<${this.id}:YYYY>/<${this.id}:MM>/<${this.id}:DD>`,
      result: "2021/02/03/test.jpg",
    },
  ];
  protected readonly regex = /<exif\.CreateDate:(.*?)>/g;

  protected getProperty(exifData: any): string {
    return exifData.exif.CreateDate;
  }
}

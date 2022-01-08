import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { inject, injectable } from "inversify";
import { ExifParserService } from "../services/exif-parser.service";
import { TYPES } from "../types";
import { AbstractRules, Rule, RuleDescription } from "./abstract.rule";

dayjs.extend(customParseFormat);

@injectable()
export class DateRules extends AbstractRules {
  constructor(@inject(TYPES.ExifParserService) protected readonly exifParser: ExifParserService) {
    super();
  }

  public readonly rulesDescriptions: Record<string, RuleDescription> = {
    "exif.DateTimeOriginal": {
      id: "exif.DateTimeOriginal",
      description: "Use EXIF date time and format date according to given format",
      examples: [
        {
          pattern: `<DateTimeOriginal:YYYY-MM-DD>`,
          result: "2021-02-03/test.jpg",
        },
        {
          pattern: `<DateTimeOriginal:YYYY>/<DateTimeOriginal:MM>`,
          result: "2021/02/test.jpg",
        },
      ],
      regex: /<exif\.DateTimeOriginal:(.*?)>/g,
      getProperty: (exifData: any) => exifData.exif.DateTimeOriginal,
    },
    "exif.CreateDate": {
      id: "exif.CreateDate",
      description: "Use EXIF created date and format date according to given format",
      examples: [
        {
          pattern: `<CreateDate:YYYY-MM-DD>`,
          result: "2021-02-03/test.jpg",
        },
        {
          pattern: `<CreateDate:YYYY>/<CreateDate:MM>`,
          result: "2021/02/test.jpg",
        },
      ],
      regex: /<exif\.CreateDate:(.*?)>/g,
      getProperty: (exifData: any) => exifData.exif.DateTimeOriginal,
    },
  };

  protected transformRule(id: string): Rule {
    const description = this.rulesDescriptions[id];

    if (description === undefined) {
      throw Error(`Rule ${id} not exists`);
    }

    return async (from, to) => {
      const matches = Array.from(to.matchAll(description.regex) ?? []);

      if (matches.length === 0) {
        return undefined;
      }

      const exifData: any = await this.exifParser.getExifData(from);

      const exifDate = description.getProperty(exifData);

      if (exifDate === undefined) {
        return;
      }

      const date = dayjs(exifDate, "YYYY:MM:DD HH:mm:ss");

      for (const [_, format] of matches) {
        to = to.replace(`<${id}:${format}>`, date.format(format));
      }

      return to;
    };
  }
}

import dayjs = require("dayjs");
import { inject, injectable } from "inversify";
import { ExifParserService } from "../services/exif-parser.service";
import { TYPES } from "../types";
import { AbstractRules, Rule, RuleDescription } from "./abstract.rule";

@injectable()
export class TextRules extends AbstractRules {
  constructor(@inject(TYPES.ExifParserService) protected readonly exifParser: ExifParserService) {
    super();
  }

  public readonly rulesDescriptions: Record<string, RuleDescription> = {
    "exif.ExposureTime": {
      id: "exif.ExposureTime",
      description: "Use EXIF exposure time number value.",
      examples: [
        {
          pattern: `<exif.ExposureTime>`,
          result: "0.0001/test.jpg",
        },
      ],
      regex: /<exif\.ExposureTime>/g,
      getProperty: (exifData: any) => exifData.exif.ExposureTime,
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

      const exifNumber = description.getProperty(exifData);

      if (exifNumber === undefined) {
        return;
      }

      for (const _ of matches) {
        to = to.replace(`<${id}>`, exifNumber);
      }

      return to;
    };
  }
}

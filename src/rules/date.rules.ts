import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { inject, injectable } from "inversify";
import { ExifParserService } from "../services/exif-parser.service";
import { TYPES } from "../types";
import { getObjectValueByPath } from "../utils/object.utils";
import { AbstractRules, Rule, RuleDescription } from "./abstract.rule";

dayjs.extend(customParseFormat);

type PartialDescription = Pick<RuleDescription, "id" | "description">;

const partialDescriptions: PartialDescription[] = [
  { id: "image.ModifyDate" },
  { id: "exif.CreateDate" },
  { id: "exif.DateTimeOriginal" },
  { id: "gps.GPSDateStamp" },
];

function expandPartialDescription(partial: PartialDescription): RuleDescription {
  const [scope, field] = partial.id.split(".");
  return {
    ...partial,
    description:
      "Parse the date and format according to format given (see https://day.js.org/docs/en/display/format for formatting)",
    example: {
      pattern: `<${partial.id}:YYYY>/<${partial.id}:MM>`,
      result: `2021/02/test.jpg`,
    },
    regex: new RegExp(`<${scope}\\.${field}:(.*?)>`, "g"),
    getProperty: (exifData: any) => getObjectValueByPath(exifData, partial.id),
  };
}

@injectable()
export class DateRules extends AbstractRules {
  constructor(@inject(TYPES.ExifParserService) protected readonly exifParser: ExifParserService) {
    super();
  }
  public readonly rulesDescriptions: Record<string, RuleDescription> = partialDescriptions.reduce(
    (acc, description) => {
      // @ts-ignore
      acc[description.id] = expandPartialDescription(description);
      return acc;
    },
    {}
  );

  protected transformRule(id: string): Rule {
    const description = this.rulesDescriptions[id];

    if (description === undefined) {
      throw Error(`Rule ${id} not exists`);
    }

    return async (from, to) => {
      const matches = Array.from(to.matchAll(description.regex) ?? []);

      if (matches.length === 0) {
        // console.warn(`not match for ${id}`);
        return undefined;
      }

      const exifData: any = await this.exifParser.getExifData(from).catch(() => ({}));

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

import dayjs = require("dayjs");
import { inject, injectable } from "inversify";
import { ExifParserService } from "../services/exif-parser.service";
import { TYPES } from "../types";
import { AbstractRules, Rule, RuleDescription } from "./abstract.rule";

const fields = [
  "image.ImageWidth",
  "image.ImageHeight",
  "image.Make",
  "image.Model",
  "image.Orientation",
  "image.XResolution",
  "image.YResolution",
  "image.ResolutionUnit",
  "image.Software",
];

type PartialDescription = Pick<RuleDescription, "id" | "description">;

const partialDescriptions: PartialDescription[] = [
  {
    id: "image.ImageWidth",
    description: "Use image width in pixels.",
  },
  {
    id: "image.ImageHeight",
    description: "Use image height in pixels.",
  },
  {
    id: "exif.ExposureTime",
    description: "Use EXIF exposure time number value.",
  },
];

function expandPartialDescription(partial: PartialDescription): RuleDescription {
  const [scope, field] = partial.id.split(".");
  return {
    ...partial,
    example: {
      pattern: `<${partial.id}>`,
      result: `1234/test.jpg`,
    },
    regex: new RegExp(`<${scope}\\.${field}`, "g"),
    getProperty: (exifData: any) => exifData[scope][field],
  };
}

@injectable()
export class TextRules extends AbstractRules {
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

import dayjs = require("dayjs");
import { inject, injectable } from "inversify";
import { ExifParserService } from "../services/exif-parser.service";
import { TYPES } from "../types";
import { AbstractRules, Rule, RuleDescription } from "./abstract.rule";

type PartialDescription = Pick<RuleDescription, "id" | "description"> & { resultExample: string };

const partialDescriptions: PartialDescription[] = [
  {
    id: "image.ImageWidth",
    resultExample: `4128`,
  },
  {
    id: "image.ImageHeight",
    resultExample: "3096",
  },
  {
    id: "image.Make",
    resultExample: "samsung",
  },
  {
    id: "image.Model",
    resultExample: "cSM-J510FN",
  },
  {
    id: "image.Orientation",
    resultExample: "6",
  },
  {
    id: "image.XResolution",
    resultExample: "72",
  },
  {
    id: "image.YResolution",
    resultExample: "72",
  },
  {
    id: "image.ResolutionUnit",
    resultExample: "2",
  },
  {
    id: "image.Software",
    resultExample: "J510FNXXU2BRE4",
  },
  {
    id: "image.YCbCrPositioning",
    resultExample: "1",
  },
  {
    id: "image.ExifOffset",
    resultExample: "240",
  },
  {
    id: "thumbnail.ImageWidth",
    resultExample: "512",
  },
  {
    id: "thumbnail.ImageHeight",
    resultExample: "384",
  },
  {
    id: "thumbnail.Compression",
    resultExample: "6",
  },
  {
    id: "thumbnail.Orientation",
    resultExample: "6",
  },
  {
    id: "thumbnail.XResolution",
    resultExample: "72",
  },
  {
    id: "thumbnail.YResolution",
    resultExample: "72",
  },
  {
    id: "thumbnail.ResolutionUnit",
    resultExample: "2",
  },
  {
    id: "thumbnail.ThumbnailOffset",
    resultExample: "3424",
  },
  {
    id: "thumbnail.ThumbnailLength",
    resultExample: "32987",
  },

  {
    id: "exif.ExposureTime",
    resultExample: "0.0029239766081871343",
  },
  {
    id: "exif.FNumber",
    resultExample: "1.9",
  },
  {
    id: "exif.ExposureProgram",
    resultExample: "2",
  },
  {
    id: "exif.ISO",
    resultExample: "64",
  },
  {
    id: "exif.ShutterSpeedValue",
    resultExample: "8.41",
  },
  {
    id: "exif.ApertureValue",
    resultExample: "1.85",
  },
  {
    id: "exif.BrightnessValue",
    resultExample: "6.9",
  },
  {
    id: "exif.ExposureCompensation",
    resultExample: "0",
  },
  {
    id: "exif.MaxApertureValue",
    resultExample: "1.85",
  },
  {
    id: "exif.MeteringMode",
    resultExample: "2",
  },
  {
    id: "exif.LightSource",
    resultExample: "0",
  },
  {
    id: "exif.Flash",
    resultExample: "0",
  },
  {
    id: "exif.FocalLength",
    resultExample: "3.7",
  },
  {
    id: "exif.ColorSpace",
    resultExample: "1",
  },
  {
    id: "exif.ExifImageWidth",
    resultExample: "4128",
  },
  {
    id: "exif.ExifImageHeight",
    resultExample: "3096",
  },
  {
    id: "exif.InteropOffset",
    resultExample: "3186",
  },
  {
    id: "exif.SensingMethod",
    resultExample: "2",
  },
  {
    id: "exif.SensingMethod",
    resultExample: "0",
  },
  {
    id: "exif.WhiteBalance",
    resultExample: "0",
  },
  {
    id: "exif.FocalLengthIn35mmFormat",
    resultExample: "28",
  },
  {
    id: "exif.SceneCaptureType",
    resultExample: "0",
  },
];

function expandPartialDescription(partial: PartialDescription): RuleDescription {
  const [scope, field] = partial.id.split(".");
  return {
    ...partial,
    example: {
      pattern: `<${partial.id}>`,
      result: `${partial.resultExample}/test.jpg`,
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

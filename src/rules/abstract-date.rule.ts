import dayjs = require("dayjs");
import { inject, injectable } from "inversify";
import { ExifParser } from "../services/exif-parser";
import { TYPES } from "../types";
import { AbstractRule } from "./abstract.rule";

@injectable()
export abstract class AbstractDateRule extends AbstractRule {
  protected abstract getProperty(exifDate: any): string;

  constructor(@inject(TYPES.ExifParser) protected readonly exifParser: ExifParser) {
    super();
  }

  async run(from: string, to: string): Promise<string | undefined> {
    const matches = Array.from(to.matchAll(this.regex) ?? []);

    if (matches.length === 0) {
      return undefined;
    }

    const exifData: any = await this.exifParser.getExifData(from);

    const createdAt = exifData.exif.CreateDate;

    if (createdAt === undefined) {
      return;
    }

    const date = dayjs(createdAt, "YYYY:MM:DD HH:mm:ss");

    for (const [_, format] of matches) {
      to = to.replace(`<${this.id}:${format}>`, date.format(format));
    }

    return to;
  }
}

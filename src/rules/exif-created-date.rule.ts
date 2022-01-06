import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { inject, injectable } from "inversify";
import { ExifParser } from "../exif-parser";
import { TYPES } from "../types";
import { AbstractRule } from "./abstract.rule";

dayjs.extend(customParseFormat);

@injectable()
export class ExifCreatedDateRule implements AbstractRule {
  id: string = "exif.CreateDate";
  private readonly regex = /<exif\.CreateDate:(.*?)>/g;

  constructor(@inject(TYPES.ExifParser) private readonly exifParser: ExifParser) {}

  async run(from: string, to: string): Promise<string | undefined> {
    const matches = Array.from(to.matchAll(this.regex));

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

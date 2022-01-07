import dayjs = require("dayjs");
import { inject, injectable } from "inversify";
import { ExifParserService } from "../../services/exif-parser.service";
import { TYPES } from "../../types";
import { AbstractRule } from "../abstract.rule";

@injectable()
export abstract class AbstractTextRule extends AbstractRule {
  protected abstract getProperty(exifData: any): string;

  constructor(@inject(TYPES.ExifParserService) protected readonly exifParser: ExifParserService) {
    super();
  }

  async run(from: string, to: string): Promise<string | undefined> {
    const matches = Array.from(to.matchAll(this.regex) ?? []);

    if (matches.length === 0) {
      return undefined;
    }

    const exifData: any = await this.exifParser.getExifData(from);

    const exifNumber = this.getProperty(exifData);

    if (exifNumber === undefined) {
      return;
    }

    for (const [_, format] of matches) {
      to = to.replace(`<${this.id}>`, exifNumber);
    }

    return to;
  }
}

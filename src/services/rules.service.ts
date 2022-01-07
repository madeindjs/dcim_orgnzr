import { inject, injectable } from "inversify";
import { AbstractRule } from "../rules/abstract.rule";
import { ExifCreateDateRule } from "../rules/exif-create-date.rule";
import { ExifDateTimeOriginalRule } from "../rules/exif-date-time-original-date.rule";
import { ExifExposureTimeRule } from "../rules/exif-exposure-time.rule";
import { TYPES } from "../types";

@injectable()
export class RulesServices {
  public readonly rules: AbstractRule[];

  constructor(
    @inject(TYPES.ExifCreatedDateRule) exifCreatedDateRule: ExifCreateDateRule,
    @inject(TYPES.ExifDateTimeOriginalRule) exifDateTimeOriginalRule: ExifDateTimeOriginalRule,
    @inject(TYPES.ExifExposureTimeRule) exifExposureTimeRule: ExifExposureTimeRule
  ) {
    this.rules = [exifCreatedDateRule, exifDateTimeOriginalRule, exifExposureTimeRule];
  }

  getExamplesAsMarkdown(): string {
    let md = `<!-- BEGIN: rules generated -->\n`;
    for (const rule of this.rules) {
      md += `### ${rule.id}\n\n${rule.description}\n\nExamples:\n\n`;

      for (const example of rule.examples) {
        md += `\`\`\`diff\n`;
        md += `- ${example.pattern}\n`;
        md += `+ ${example.result}\n`;
        md += `\`\`\`\n`;
        // md += `- \`${example.pattern}\` => \`${example.result}\`\n`;
      }
      md += `\n`;
    }
    md += `<!-- END -->`;
    return md;
  }
}

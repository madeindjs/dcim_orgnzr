import { container } from "../container";
import { ExifParserService } from "../services/exif-parser.service";
import { TYPES } from "../types";

async function main() {
  return container.get<ExifParserService>(TYPES.ExifParserService).getExifData(process.argv[2]);
}

main().then(console.log).catch(console.error);

import { inject, injectable } from "inversify";
import { Configuration, ConfigurationService } from "./configuration";
import { ExifParser } from "./exif-parser";
import { TYPES } from "./types";

// @ts-check
const walk = require("walkdir");
const path = require("path");

interface Move {
  from: string;
  to: string;
}

@injectable()
export class ComputeMoveService {
  constructor(
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService,
    @inject(TYPES.ExifParser) private readonly exifParser: ExifParser
  ) {}

  async getMovesForDirectory(directoryPath: string, configuration?: Configuration): Promise<Move[]> {
    if (configuration === undefined) {
      configuration = await this.configurationService.fromDirectory(directoryPath);
    }

    const moves: Move[] = [];

    let result = await walk.async(directoryPath, { return_object: true });

    for (const filepath of Object.keys(result)) {
      const move = await this.getMoveForFile(filepath, configuration);

      if (move !== undefined) {
        moves.push(move);
      }
    }

    return moves;
  }

  async getMoveForFile(file: string, configuration: Configuration) {
    if (![".jpg"].includes(path.extname(file))) {
      return;
    }

    const directoryPath = path.dirname(file);

    const haveExifRule = configuration.rules.some(({ property }) => property.startsWith("exif"));

    if (haveExifRule) {
      const exifData: any = await this.exifParser.getExifData(file);
      const createdDateRule = configuration.rules.find(({ property }) => property === "exif.CreateDate");

      if (createdDateRule) {
        const createdAt = exifData.exif.CreateDate;

        return {
          from: file,
          to: path.join(directoryPath, createdDateRule.destination.replace("$1", createdAt), path.basename(file)),
        };
      }
    }
  }
}

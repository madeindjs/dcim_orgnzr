import { inject, injectable } from "inversify";
import { Configuration, ConfigurationService } from "./configuration";
import { ExifParser } from "./exif-parser";
import { AbstractRule } from "./rules/abstract.rule";
import { ExifCreatedDateRule } from "./rules/exif-created-date.rule";
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
  private readonly rules: AbstractRule[];

  constructor(
    @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService,
    @inject(TYPES.ExifParser) private readonly exifParser: ExifParser,
    @inject(TYPES.ExifCreatedDateRule) exifCreatedDateRule: ExifCreatedDateRule
  ) {
    this.rules = [exifCreatedDateRule];
  }

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

  async getMoveForFile(from: string, configuration: Configuration): Promise<Move | undefined> {
    if (![".jpg"].includes(path.extname(from))) {
      return;
    }

    let to = from;

    const directoryPath = path.dirname(from);

    for (const rule of this.rules) {
      const result = await rule.run(to, configuration.destination);

      if (result) {
        to = result;
      }
    }

    if (to !== from) {
      return {
        from,
        to,
      };
    }
  }
}

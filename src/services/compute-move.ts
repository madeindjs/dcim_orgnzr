import { inject, injectable } from "inversify";
import { basename, join } from "path";
import { TYPES } from "../types";
import { RulesServices } from "./rules.service";

// @ts-check
const walk = require("walkdir");
const path = require("path");

export interface Move {
  from: string;
  to: string;
}

interface Options {
  dryRun?: boolean;
}

@injectable()
export class ComputeMoveService {
  constructor(@inject(TYPES.RulesServices) private readonly rulesService: RulesServices) {}

  async *getMovesForDirectory(directoryPath: string, pattern: string): AsyncGenerator<Move, void, Move> {
    let result = await walk.async(directoryPath, { return_object: true });

    for (const filepath of Object.keys(result)) {
      const move = await this.getMoveForFile(filepath, pattern, directoryPath);
      if (move) {
        yield move;
      }
    }
  }

  async getMoveForFile(from: string, pattern: string, directoryPath: string): Promise<Move | undefined> {
    if (![".jpg"].includes(path.extname(from))) {
      return;
    }

    let to = from;

    for (const rule of this.rulesService.getRules()) {
      const result = await rule(to, pattern);

      if (result) {
        to = join(directoryPath, result, basename(from));
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

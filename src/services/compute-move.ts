import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { RulesServices } from "./rules.service";

// @ts-check
const walk = require("walkdir");
const path = require("path");

interface Move {
  from: string;
  to: string;
}

@injectable()
export class ComputeMoveService {
  constructor(@inject(TYPES.RulesServices) private readonly rulesService: RulesServices) {}

  async getMovesForDirectory(directoryPath: string, pattern: string): Promise<Move[]> {
    const moves: Move[] = [];

    let result = await walk.async(directoryPath, { return_object: true });

    for (const filepath of Object.keys(result)) {
      const move = await this.getMoveForFile(filepath, pattern);

      if (move !== undefined) {
        moves.push(move);
      }
    }

    return moves;
  }

  async getMoveForFile(from: string, pattern: string): Promise<Move | undefined> {
    if (![".jpg"].includes(path.extname(from))) {
      return;
    }

    let to = from;

    for (const rule of this.rulesService.rules) {
      const result = await rule.run(to, pattern);

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

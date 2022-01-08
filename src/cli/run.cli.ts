#!/usr/bin/env node
import { rename, writeFile } from "fs/promises";
import { join } from "path";
import "reflect-metadata";
import { parse } from "ts-command-line-args";
import { container } from "../container";
import { ComputeMoveService } from "../services/compute-move";
import { TYPES } from "../types";
import { argumentConfig, parseOptions } from "./constants.cli";

async function main() {
  const args = parse(argumentConfig, parseOptions);
  const generator = await container
    .get<ComputeMoveService>(TYPES.ComputeMoveService)
    .getMovesForDirectory(args.path as string, args.pattern, { dryRun: args.dryRun });

  const backupFile = join(args.path as string, `dcim-orgnzr.revert.${new Date().toISOString()}.sh`);

  const movesPromises: Promise<void>[] = [];

  // @ts-ignore
  for await (const move of generator) {
    const moveCmd = `mv ${move.from}  ${move.to}`;
    console.log(moveCmd);
    if (!args.dryRun) {
      movesPromises.push(rename(move.from, move.to).then(() => writeFile(backupFile, `${moveCmd}\n`, { mode: "a" })));
    }
  }

  return Promise.all(movesPromises);
}

main().catch(console.error);

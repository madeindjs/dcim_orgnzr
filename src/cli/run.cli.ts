#!/usr/bin/env node
import { mkdir, rename, writeFile } from "fs/promises";
import { dirname, join } from "path";
import "reflect-metadata";
import { parse } from "ts-command-line-args";
import { container } from "../container";
import { ComputeMoveService, Move } from "../services/compute-move";
import { TYPES } from "../types";
import { argumentConfig, parseOptions } from "./constants.cli";

async function handleMove(move: Move, backupFile: string) {
  await mkdir(dirname(move.to), { recursive: true });
  await rename(move.from, move.to);
  await writeFile(backupFile, `mv ${move.to} ${move.from}\n`, { flag: "a+" });
}

async function main() {
  const args = parse(argumentConfig, parseOptions);
  const generator = await container
    .get<ComputeMoveService>(TYPES.ComputeMoveService)
    .getMovesForDirectory(args.path as string, args.pattern);

  const backupFile = join(args.path as string, `dcim-orgnzr.revert.${new Date().getTime()}.sh`);

  const movesPromises: Promise<void>[] = [];

  // @ts-ignore
  for await (const move of generator) {
    const moveCmd = `mv ${move.from}  ${move.to}`;
    console.log(moveCmd);
    if (!args.dryRun) {
      movesPromises.push(handleMove(move, backupFile));
    }
  }

  return Promise.all(movesPromises);
}

main().catch(console.error);

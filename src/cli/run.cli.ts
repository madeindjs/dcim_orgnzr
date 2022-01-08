#!/usr/bin/env node
import { rename } from "fs/promises";
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

  const movesPromises: Promise<void>[] = [];

  // @ts-ignore
  for await (const move of generator) {
    console.log(`mv ${move.from}  ${move.to}`);
    if (!args.dryRun) {
      movesPromises.push(rename(move.from, move.to));
    }
  }

  return Promise.all(movesPromises);
}

main().catch(console.error);

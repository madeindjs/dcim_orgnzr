#!/usr/bin/env node
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

  // @ts-ignore
  for await (const move of generator) {
    console.log(`mv ${move.from}  ${move.to}`);
  }
}

main().catch(console.error);

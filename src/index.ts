import "reflect-metadata";
import { ComputeMoveService } from "./compute-move";
import { container } from "./container";
import { TYPES } from "./types";

const directoryPath = process.argv[2];

if (directoryPath === undefined) {
  throw Error("You must provide a directory");
}

container
  .get<ComputeMoveService>(TYPES.ComputeMoveService)
  .getMovesForDirectory(directoryPath)
  .then(console.log)
  .catch(console.error);

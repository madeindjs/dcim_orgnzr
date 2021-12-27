import "reflect-metadata";
import { container } from "./container";
import { ComputeMoveService } from "./organizer";
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

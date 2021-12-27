// @ts-check
const { getMovesForDirectory } = require("./organizer.js");

const directoryPath = process.argv[2];

if (directoryPath === undefined) {
  throw Error("You must provide a directory");
}

getMovesForDirectory(directoryPath).then(console.log).catch(console.error);

// @ts-check
const { loadConfiguration } = require("./configuration.js");
const walk = require("walkdir");
const path = require("path");
const { getExifData } = require("./utils.js");

const directoryPath = process.argv[2];

if (directoryPath === undefined) {
  throw Error("You must provide a directory");
}

async function main() {
  const configuration = await loadConfiguration(directoryPath);

  const haveExifRule = configuration.rules.some(({ property }) => property.startsWith("exif"));

  /** @type {{from: string, to: string}[]} */
  const moves = [];

  let result = await walk.async(directoryPath, { return_object: true });

  for (const file of Object.keys(result)) {
    if (![".jpg"].includes(path.extname(file))) {
      return;
    }

    if (haveExifRule) {
      const exifData = await getExifData(file);
      const createdDateRule = configuration.rules.find(({ property }) => property === "exif.CreateDate");

      if (createdDateRule) {
        const createdAt = exifData.exif.CreateDate;

        moves.push({
          from: file,
          to: path.join(directoryPath, createdDateRule.destination.replace("$1", createdAt), path.basename(file)),
        });
        console.log(moves);
      }
    }
  }

  console.log(moves);
}

main().catch(console.error);

// @ts-check
const walk = require("walkdir");
const path = require("path");

const { loadConfiguration } = require("./configuration");
const { getExifData } = require("./utils");

/**
 *
 * @typedef {{from: string, to: string}} Move
 */

/**
 *
 * @param {string} file
 * @param {import('./configuration').ConfigurationV1} configuration
 * @returns {Promise<Move | undefined>}
 */
async function getMoveForFile(file, configuration) {
  if (![".jpg"].includes(path.extname(file))) {
    return;
  }

  const directoryPath = path.dirname(file);

  const haveExifRule = configuration.rules.some(({ property }) => property.startsWith("exif"));

  if (haveExifRule) {
    const exifData = await getExifData(file);
    const createdDateRule = configuration.rules.find(({ property }) => property === "exif.CreateDate");

    if (createdDateRule) {
      const createdAt = exifData.exif.CreateDate;

      return {
        from: file,
        to: path.join(directoryPath, createdDateRule.destination.replace("$1", createdAt), path.basename(file)),
      };
    }
  }
}

/**
 * @param {string} directoryPath
 * @param {import('./configuration').ConfigurationV1} configuration
 * @returns {Promise<Move[]>}
 */
async function getMovesForDirectory(directoryPath, configuration = undefined) {
  if (configuration === undefined) {
    configuration = await loadConfiguration(directoryPath);
  }

  /** @type {Move[]} */
  const moves = [];

  let result = await walk.async(directoryPath, { return_object: true });

  for (const filepath of Object.keys(result)) {
    const move = await getMoveForFile(filepath, configuration);

    if (move !== undefined) {
      moves.push(move);
    }
  }

  return moves;
}

module.exports = { getMovesForDirectory };

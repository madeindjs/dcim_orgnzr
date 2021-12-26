// @ts-check
const { isFileExists } = require("./utils");
const path = require("path");
const { validate } = require("jsonschema");
const configurationSchema = require("./configuration.v1.schema.json");

const CONFIGURATION_FILE = "dcim-orgnzr.json";

/**
 *
 * @typedef Rule
 * @property {string} destination
 * @property {'exif.CreateDate'} property
 */

/**
 * @typedef ConfigurationV1
 * @property {1} version
 * @property {Array<Rule>} rules
 */

/**
 * @param {string} directoryPath
 * @returns {Promise<ConfigurationV1>}
 */
async function loadConfiguration(directoryPath) {
  const configurationFile = path.join(directoryPath, CONFIGURATION_FILE);

  if (!(await isFileExists(configurationFile))) {
    throw Error(`Cannot open ${configurationFile}`);
  }

  const configuration = require(configurationFile);

  const validation = validate(configuration, configurationSchema);

  if (!validation.valid) {
    throw Error(`Configuration file is not valid\n${validation.toString()}`);
  }

  return configuration;
}

module.exports = { loadConfiguration };

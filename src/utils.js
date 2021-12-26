// @ts-check
const fs = require("fs/promises");
const ExifImage = require("exif").ExifImage;

/**
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function isFileExists(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

function getExifData(path) {
  return new Promise((resolve, reject) => {
    new ExifImage({ image: path }, (exifError, exifData) => {
      if (exifError) {
        console.error("cannot read exif");
        return reject(exifError);
      }
      return resolve(exifData);
    });
  });
}

module.exports = {
  isFileExists,
  getExifData,
};

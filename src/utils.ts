import { ExifImage } from "exif";
import { stat } from "fs/promises";

/**
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export async function isFileExists(path: string) {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

export function getExifData(path: string) {
  return new Promise((resolve, reject) => {
    new ExifImage({ image: path }, (exifError: any, exifData: any) => {
      if (exifError) {
        console.error("cannot read exif");
        return reject(exifError);
      }
      return resolve(exifData);
    });
  });
}

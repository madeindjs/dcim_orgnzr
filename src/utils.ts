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

import { ExifImage } from "exif";
import { injectable } from "inversify";

@injectable()
export class ExifParserService {
  private readonly cache = new Map<string, object>();

  getExifData(path: string, force = false) {
    if (!force) {
      const cache = this.cache.get(path);

      if (cache) {
        return cache;
      }
    }

    return new Promise((resolve, reject) => {
      new ExifImage({ image: path }, (exifError: any, exifData: any) => {
        if (exifError) {
          return reject(exifError);
        }
        return resolve(exifData);
      });
    });
  }
}

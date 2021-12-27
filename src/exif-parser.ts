import { ExifImage } from "exif";
import { injectable } from "inversify";

@injectable()
export class ExifParser {
  getExifData(path: string) {
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

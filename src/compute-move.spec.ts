import { expect, use } from "chai";
import * as chaiAsPromise from "chai-as-promised";
import { Container } from "inversify";
import { join } from "path";
import "reflect-metadata";
import { ComputeMoveService } from "./compute-move";
import { Configuration, ConfigurationRuleProperty, ConfigurationService } from "./configuration";
import { ExifParser } from "./exif-parser";
import { TYPES } from "./types";

use(chaiAsPromise);

describe(ComputeMoveService.name, () => {
  let computeMoveService: ComputeMoveService;

  beforeEach(() => {
    const container = new Container();
    container.bind(TYPES.ConfigurationService).to(ConfigurationService);
    container.bind(TYPES.ComputeMoveService).to(ComputeMoveService);
    container
      .bind(TYPES.ExifParser)
      .toConstantValue({ getExifData: async () => ({ exif: { CreateDate: "2018:08:05 12:24:42" } }) } as ExifParser);
    computeMoveService = container.get(TYPES.ComputeMoveService);
  });

  describe("getMoveForFile", () => {
    it("should move with all date of exif", async () => {
      const configuration: Configuration = {
        version: 1,
        rules: [{ destination: "$1-test", property: ConfigurationRuleProperty.ExifCreateDate }],
      };

      const result = await computeMoveService.getMoveForFile(join(__dirname, "test.jpg"), configuration);

      expect(result).deep.eq({
        from: join(__dirname, "test.jpg"),
        to: join(__dirname, "2018:08:05 12:24:42-test", "test.jpg"),
      });
    });
  });
});

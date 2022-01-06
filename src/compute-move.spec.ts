import { expect, use } from "chai";
import * as chaiAsPromise from "chai-as-promised";
import { Container } from "inversify";
import "reflect-metadata";
import { ComputeMoveService } from "./compute-move";
import { Configuration, ConfigurationService } from "./configuration";
import { ExifParser } from "./exif-parser";
import { fixturesImages } from "./fixtures.spec";
import { containerRulesModule } from "./rules/container-rule";
import { TYPES } from "./types";

use(chaiAsPromise);

describe(ComputeMoveService.name, () => {
  let computeMoveService: ComputeMoveService;

  beforeEach(() => {
    const container = new Container();
    container.bind(TYPES.ConfigurationService).to(ConfigurationService);
    container.bind(TYPES.ComputeMoveService).to(ComputeMoveService);
    container.load(containerRulesModule);
    container.bind(TYPES.ExifParser).toConstantValue({
      getExifData: async () => ({ exif: { CreateDate: "2018:08:05 12:24:42" } }),
    } as unknown as ExifParser);
    computeMoveService = container.get(TYPES.ComputeMoveService);
  });

  describe("getMoveForFile", () => {
    it("should move with all date of exif", async () => {
      const configuration: Configuration = {
        version: 1,
        destination: "<exif.CreateDate:MM>",
      };

      const result = await computeMoveService.getMoveForFile(fixturesImages.me, configuration);

      expect(result).deep.eq({
        from: fixturesImages.me,
        to: "08",
      });
    });
  });
});

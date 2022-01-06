import { expect, use } from "chai";
import * as chaiAsPromise from "chai-as-promised";
import { Container } from "inversify";
import "reflect-metadata";
import { fixturesImages } from "../fixtures.spec";
import { containerRulesModule } from "../rules/container-rule";
import { TYPES } from "../types";
import { ComputeMoveService } from "./compute-move";
import { ExifParser } from "./exif-parser";
import { RulesServices } from "./rules.service";

use(chaiAsPromise);

describe(ComputeMoveService.name, () => {
  let computeMoveService: ComputeMoveService;

  beforeEach(() => {
    const container = new Container();
    container.bind(TYPES.ComputeMoveService).to(ComputeMoveService);
    container.bind(TYPES.RulesServices).to(RulesServices);
    container.load(containerRulesModule);
    container.bind(TYPES.ExifParser).toConstantValue({
      getExifData: async () => ({ exif: { CreateDate: "2018:08:05 12:24:42" } }),
    } as unknown as ExifParser);
    computeMoveService = container.get(TYPES.ComputeMoveService);
  });

  describe("getMoveForFile", () => {
    it("should move with all date of exif", async () => {
      const result = await computeMoveService.getMoveForFile(fixturesImages.me, "<exif.CreateDate:MM>");

      expect(result).deep.eq({
        from: fixturesImages.me,
        to: "08",
      });
    });
  });
});

import { expect } from "chai";
import * as path from "path";
import { container } from "../container";
import { fixturesImages } from "../fixtures.spec";
import { TYPES } from "../types";
import { ExifExposureTimeRule } from "./exif-exposure-time.rule";

describe(ExifExposureTimeRule.name, () => {
  let service: ExifExposureTimeRule;

  before(() => {
    service = container.get(TYPES.ExifExposureTimeRule);
  });

  it("should replace text", async () => {
    const result = await service.run(fixturesImages.me, path.join(fixturesImages.me, `<${service.id}>`));
    expect(result).eq(path.join(fixturesImages.me, `0.0029239766081871343`));
  });

  it("should do nothing", async () => {
    const result = await service.run(fixturesImages.me, path.join(fixturesImages.me, `<toto>`));
    expect(result).be.undefined;
  });
});

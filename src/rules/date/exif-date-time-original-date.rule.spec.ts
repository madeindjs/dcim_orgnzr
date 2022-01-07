import { expect } from "chai";
import * as path from "path";
import { container } from "../../container";
import { fixturesImages } from "../../fixtures.spec";
import { TYPES } from "../../types";
import { ExifDateTimeOriginalRule } from "./exif-date-time-original-date.rule";

describe(ExifDateTimeOriginalRule.name, () => {
  let service: ExifDateTimeOriginalRule;

  before(() => {
    service = container.get(TYPES.ExifCreatedDateRule);
  });

  it("should replace month", async () => {
    const result = await service.run(fixturesImages.me, path.join(fixturesImages.me, `<${service.id}:MM>`));
    expect(result).eq(path.join(fixturesImages.me, `08`));
  });

  it("should multiples tags", async () => {
    const result = await service.run(
      fixturesImages.me,
      path.join(fixturesImages.me, `<${service.id}:YYYY>/<${service.id}:MM>/<${service.id}:DD>`)
    );
    expect(result).eq(path.join(fixturesImages.me, "2018", "08", "05"));
  });

  it("should do nothing", async () => {
    const result = await service.run(fixturesImages.me, path.join(fixturesImages.me, `<toto:MM>`));
    expect(result).be.undefined;
  });
});

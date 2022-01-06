import { expect } from "chai";
import * as path from "path";
import { container } from "../container";
import { fixturesImages } from "../fixtures.spec";
import { TYPES } from "../types";
import { ExifCreatedDateRule } from "./exif-created-date.rule";

describe(ExifCreatedDateRule.name, () => {
  let service: ExifCreatedDateRule;

  before(() => {
    service = container.get(TYPES.ExifCreatedDateRule);
  });

  it("should replace month", async () => {
    const result = await service.run(fixturesImages.me, path.join(fixturesImages.me, `<${service.id}:MM>`));
    expect(result).eq(path.join(fixturesImages.me, `08`));
  });

  it("should do nothing", async () => {
    const result = await service.run(fixturesImages.me, path.join(fixturesImages.me, `<toto:MM>`));
    expect(result).be.undefined;
  });
});

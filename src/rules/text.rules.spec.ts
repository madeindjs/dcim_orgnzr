import { expect } from "chai";
import * as path from "path";
import { container } from "../container";
import { fixturesImages } from "../fixtures.spec";
import { TYPES } from "../types";
import { Rule } from "./abstract.rule";
import { TextRules } from "./text.rules";

describe(TextRules.name, () => {
  let service: TextRules = container.get(TYPES.TextRules);

  describe("image.ImageWidth", () => {
    let rule: Rule;

    beforeEach(() => {
      rule = service.getRule("image.ImageWidth");
    });

    it("should replace text", async () => {
      const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<image.ImageWidth>`));
      expect(result).eq(path.join(fixturesImages.me, `4128`));
    });

    it("should do nothing", async () => {
      const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<toto>`));
      expect(result).be.undefined;
    });
  });

  describe("exit.ExposureTime", () => {
    let rule: Rule;

    beforeEach(() => {
      rule = service.getRule("exif.ExposureTime");
    });

    it("should replace text", async () => {
      const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<exif.ExposureTime>`));
      expect(result).eq(path.join(fixturesImages.me, `0.0029239766081871343`));
    });

    it("should do nothing", async () => {
      const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<toto>`));
      expect(result).be.undefined;
    });
  });
});

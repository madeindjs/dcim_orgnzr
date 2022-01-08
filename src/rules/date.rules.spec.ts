import { expect } from "chai";
import * as path from "path";
import { container } from "../container";
import { fixturesImages } from "../fixtures.spec";
import { TYPES } from "../types";
import { Rule } from "./abstract.rule";
import { DateRules } from "./date.rules";

describe(DateRules.name, () => {
  let service: DateRules = container.get(TYPES.DateRules);

  describe("exif.DateTimeOriginal", () => {
    let rule: Rule;

    beforeEach(() => {
      rule = service.getRule("exif.DateTimeOriginal");
    });

    it("should replace month", async () => {
      const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<exif.DateTimeOriginal:MM>`));
      expect(result).eq(path.join(fixturesImages.me, `08`));
    });

    it("should multiples tags", async () => {
      const result = await rule(
        fixturesImages.me,
        path.join(
          fixturesImages.me,
          `<exif.DateTimeOriginal:YYYY>/<exif.DateTimeOriginal:MM>/<exif.DateTimeOriginal:DD>`
        )
      );
      expect(result).eq(path.join(fixturesImages.me, "2018", "08", "05"));
    });

    it("should do nothing", async () => {
      const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<toto:MM>`));
      expect(result).be.undefined;
    });
  });
});

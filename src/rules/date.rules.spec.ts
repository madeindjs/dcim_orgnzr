import { expect } from "chai";
import * as path from "path";
import { container } from "../container";
import { fixturesImages } from "../fixtures.spec";
import { TYPES } from "../types";
import { Rule } from "./abstract.rule";
import { DateRules } from "./date.rules";

describe(DateRules.name, () => {
  let service: DateRules = container.get(TYPES.DateRules);

  for (const id of Object.keys(service.rulesDescriptions)) {
    describe(id, () => {
      let rule: Rule;

      beforeEach(() => {
        rule = service.getRule(id);
      });

      it("should replace month", async () => {
        const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<${id}:MM>`));
        expect(result).eq(path.join(fixturesImages.me, `08`));
      });

      it("should multiples tags", async () => {
        const result = await rule(
          fixturesImages.me,
          path.join(fixturesImages.me, `<${id}:YYYY>/<${id}:MM>/<${id}:DD>`)
        );
        expect(result).eq(path.join(fixturesImages.me, "2018", "08", "05"));
      });

      it("should do nothing", async () => {
        const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<toto:MM>`));
        expect(result).be.undefined;
      });
    });
  }
});

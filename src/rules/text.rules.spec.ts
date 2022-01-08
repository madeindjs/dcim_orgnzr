import { expect } from "chai";
import * as path from "path";
import { container } from "../container";
import { fixturesImages } from "../fixtures.spec";
import { TYPES } from "../types";
import { Rule } from "./abstract.rule";
import { TextRules } from "./text.rules";

describe(TextRules.name, () => {
  let service: TextRules = container.get(TYPES.TextRules);

  for (const id of Object.keys(service.rulesDescriptions)) {
    describe(id, () => {
      let rule: Rule;

      beforeEach(() => {
        rule = service.getRule(id);
      });

      it("should replace text", async () => {
        const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<${id}>`));
        expect(result).eq(path.join(fixturesImages.me, `0.0029239766081871343`));
      });

      it("should do nothing", async () => {
        const result = await rule(fixturesImages.me, path.join(fixturesImages.me, `<toto>`));
        expect(result).be.undefined;
      });
    });
  }
});

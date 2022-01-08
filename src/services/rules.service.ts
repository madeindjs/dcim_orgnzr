import { inject, injectable } from "inversify";
import { Rule, RuleDescription } from "../rules/abstract.rule";
import { DateRules } from "../rules/date.rules";
import { TextRules } from "../rules/text.rules";
import { TYPES } from "../types";

@injectable()
export class RulesServices {
  constructor(
    @inject(TYPES.TextRules) private readonly textRules: TextRules,
    @inject(TYPES.DateRules) private readonly dateRules: DateRules
  ) {}

  getRules(): Rule[] {
    return [...this.textRules.getRules(), ...this.dateRules.getRules()];
  }

  getRulesDescriptions(): RuleDescription[] {
    return [...Object.values(this.textRules.rulesDescriptions), ...Object.values(this.dateRules.rulesDescriptions)];
  }
}

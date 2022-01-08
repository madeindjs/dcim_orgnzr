import { injectable } from "inversify";

export interface RuleExample {
  pattern: string;
  result: string;
  description?: string;
}

@injectable()
export abstract class AbstractRules {
  public abstract readonly rulesDescriptions: Record<string, RuleDescription>;

  public getRule(id: string): Rule {
    return this.transformRule(id);
  }

  public getRules(): Rule[] {
    return Object.keys(this.rulesDescriptions).map((id) => this.transformRule(id));
  }

  protected abstract transformRule(id: string): Rule;
}

export type Rule = (from: string, to: string) => Promise<string | undefined>;

export interface RuleDescription {
  id: string;
  description: string;
  example: RuleExample;
  regex: RegExp;
  getProperty: (exifData: any) => string;
}

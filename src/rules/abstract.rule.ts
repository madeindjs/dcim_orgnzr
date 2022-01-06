export interface RuleExample {
  pattern: string;
  result: string;
  description?: string;
}

export abstract class AbstractRule {
  public abstract readonly id: string;
  public abstract readonly description: string;
  public abstract readonly examples: RuleExample[];
  protected abstract readonly regex: RegExp;

  abstract run(from: string, to: string): Promise<string | undefined>;
}

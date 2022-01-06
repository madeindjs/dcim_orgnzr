export abstract class AbstractRule {
  public abstract readonly id: string;

  abstract run(from: string, to: string): Promise<string | undefined>;
}

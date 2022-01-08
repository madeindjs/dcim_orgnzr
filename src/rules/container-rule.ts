import { ContainerModule } from "inversify";
import { TYPES } from "../types";
import { DateRules } from "./date.rules";
import { TextRules } from "./text.rules";

export const containerRulesModule = new ContainerModule((registry) => {
  registry(TYPES.TextRules).to(TextRules);
  registry(TYPES.DateRules).to(DateRules);
});

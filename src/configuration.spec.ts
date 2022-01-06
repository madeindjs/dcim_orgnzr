import { expect, use } from "chai";
import * as chaiAsPromise from "chai-as-promised";
import "reflect-metadata";
import { ConfigurationService } from "./configuration";
import { container } from "./container";
import { TYPES } from "./types";

use(chaiAsPromise);

describe(ConfigurationService.name, () => {
  let configurationService: ConfigurationService;

  beforeEach(() => {
    configurationService = container.get(TYPES.ConfigurationService);
  });

  describe("create", () => {
    it("should be invalid because not enough rules", async () => {
      await expect(configurationService.create({ version: 1, destination: undefined } as any)).to.be.rejected;
    });

    it("should be valid", async () => {
      await expect(
        configurationService.create({
          version: 1,
          destination: "",
        })
      ).to.not.be.rejected;
    });
  });
});

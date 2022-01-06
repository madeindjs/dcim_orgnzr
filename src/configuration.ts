import { IsNumber, IsPositive, IsString, validate } from "class-validator";
import { injectable } from "inversify";
import { join } from "path";
import { isFileExists } from "./utils";

const CONFIGURATION_FILE = "dcim-orgnzr.json";

export class Configuration {
  @IsNumber()
  @IsPositive()
  version!: number;

  @IsString()
  destination!: string;
}

@injectable()
export class ConfigurationService {
  async fromDirectory(directoryPath: string): Promise<Configuration> {
    const configurationFile = join(directoryPath, CONFIGURATION_FILE);

    if (!(await isFileExists(configurationFile))) {
      throw Error(`Cannot open ${configurationFile}`);
    }
    const configuration = require(configurationFile);

    return this.create(configuration);
  }

  async create(obj: Configuration): Promise<Configuration> {
    const configuration = new Configuration();

    Object.assign(configuration, obj);

    const errors = await validate(configuration);

    if (errors.length) {
      throw Error(JSON.stringify(errors));
    }

    return configuration;
  }
}

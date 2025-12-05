import { BuildersApi } from "../api/builders.js";
import { HealthApi } from "../api/health.js";
import { HoldersApi } from "../api/holders.js";
import { MiscApi } from "../api/misc.js";
import { UsersApi } from "../api/users.js";
import { BaseClient, type DataConfig } from "./base.js";

export type { DataConfig };

export class Data extends BaseClient {
  public readonly health: HealthApi;
  public readonly builders: BuildersApi;
  public readonly users: UsersApi;
  public readonly holders: HoldersApi;
  public readonly misc: MiscApi;

  constructor(config: DataConfig = {}) {
    super(config);

    this.health = new HealthApi(this);
    this.builders = new BuildersApi(this);
    this.users = new UsersApi(this);
    this.holders = new HoldersApi(this);
    this.misc = new MiscApi(this);
  }
}

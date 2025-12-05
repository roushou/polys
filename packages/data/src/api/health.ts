import type { BaseClient } from "../client/base.js";

export class HealthApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get Data API status
   */
  async check(): Promise<Health> {
    return this.client.request<Health>({
      method: "GET",
      path: "/",
    });
  }
}

export type Health = {
  data: string;
};

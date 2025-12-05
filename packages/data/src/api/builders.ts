import type { BaseClient } from "../client/base.js";

export class BuildersApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get builder leaderboard
   */
  async leaderboard({
    timePeriod,
    limit = 25,
    offset = 0,
  }: GetLeaderboardParams): Promise<Builder[]> {
    return this.client.request<Builder[]>({
      method: "GET",
      path: "/v1/builders/leaderboard",
      params: {
        // The API expects an uppercase value
        // https://docs.polymarket.com/api-reference/builders/get-aggregated-builder-leaderboard#parameter-time-period
        timePeriod: timePeriod.toUpperCase(),
        limit,
        offset,
      },
    });
  }

  /**
   * Get daily time-series volume data with multiple entries per builder (one per day)
   */
  async volume(timePeriod: TimePeriod): Promise<Builder[]> {
    return this.client.request<Builder[]>({
      method: "GET",
      path: "/v1/builders/volume",
      params: {
        // The API expects an uppercase value
        // https://docs.polymarket.com/api-reference/builders/get-daily-builder-volume-time-series#parameter-time-period
        timePeriod: timePeriod.toUpperCase(),
      },
    });
  }
}

export type TimePeriod = "day" | "week" | "month" | "all";

export type GetLeaderboardParams = {
  /** The time period to aggregate results over */
  timePeriod: TimePeriod;

  /** Maximum number of items to return (default: 25) */
  limit?: number;

  /** Offset for pagination (default: 0) */
  offset?: number;
};

export type Builder = {
  rank: string;
  builder: string;
  volume: number;
  activeUsers: number;
  verified: boolean;
  builderLogo?: string;
};

import { v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";

export class BuildersApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get builder leaderboard
   */
  async leaderboard(params: GetLeaderboardParams): Promise<Builder[]> {
    const validated = validate(GetLeaderboardSchema, params);

    return this.client.request<Builder[]>({
      method: "GET",
      path: "/v1/builders/leaderboard",
      params: {
        // The API expects an uppercase value
        // https://docs.polymarket.com/api-reference/builders/get-aggregated-builder-leaderboard#parameter-time-period
        timePeriod: validated.timePeriod.toUpperCase(),
        limit: validated.limit,
        offset: validated.offset,
      },
    });
  }

  /**
   * Get daily time-series volume data with multiple entries per builder (one per day)
   */
  async volume(timePeriod: TimePeriod): Promise<Builder[]> {
    validate(TimePeriodSchema, timePeriod, "timePeriod");

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

const TimePeriodSchema = v.picklist(["day", "week", "month", "all"]);

const GetLeaderboardSchema = v.pipe(
  v.object({
    timePeriod: TimePeriodSchema,
    limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 25),
    offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 0),
  }),
  v.metadata({ title: "GetLeaderboardParams" }),
);

export type TimePeriod = v.InferInput<typeof TimePeriodSchema>;
export type GetLeaderboardParams = v.InferInput<typeof GetLeaderboardSchema>;

export type Builder = {
  rank: string;
  builder: string;
  volume: number;
  activeUsers: number;
  verified: boolean;
  builderLogo?: string;
};

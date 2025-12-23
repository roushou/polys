import { NonEmptyString, v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";

export class HoldersApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * List top holders for markets
   */
  async listHolders(params: ListHoldersParams): Promise<MarketHolders> {
    const validated = validate(ListHoldersSchema, params);

    return this.client.request<MarketHolders>({
      method: "GET",
      path: "/holders",
      params: {
        market: validated.market,
        limit: validated.limit,
        minBalance: validated.minBalance,
      },
    });
  }
}

const ListHoldersSchema = v.pipe(
  v.object({
    market: NonEmptyString,
    limit: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(500)),
      100,
    ),
    minBalance: v.optional(
      v.pipe(v.number(), v.minValue(0), v.maxValue(999999)),
      0,
    ),
  }),
  v.metadata({ title: "ListHoldersParams" }),
);

export type ListHoldersParams = v.InferInput<typeof ListHoldersSchema>;

export type Holder = {
  proxyWallet: string;
  bio?: string;
  asset?: string;
  pseudonym?: string;
  amount: number;
  displayUsernamePublic?: boolean;
  outcomeIndex: number;
  name?: string;
  profileImage?: string;
  profileImageOptimized?: string;
};

export type MarketHolders = {
  token: string;
  holders: Holder[];
};

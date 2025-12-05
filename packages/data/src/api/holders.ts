import type { BaseClient } from "../client/base.js";

export class HoldersApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * List top holders for markets
   */
  async listHolders({
    market,
    limit = 100,
    minBalance = 0,
  }: ListHoldersParams): Promise<MarketHolders> {
    return this.client.request<MarketHolders>({
      method: "GET",
      path: "/holders",
      params: {
        market,
        limit,
        minBalance,
      },
    });
  }
}

export type ListHoldersParams = {
  market: string; // comma-separated condition IDs
  limit?: number; // 0-500, default: 100
  minBalance?: number; // 0-999999, default: 1
};

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

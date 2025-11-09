import type { BaseClient } from "../base-client.ts";

export class AccountRequests {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get balance and allowance for a token
   */
  async getBalanceAllowance(
    tokenId: string,
    address: string,
  ): Promise<BalanceAllowanceResponse> {
    return this.client.request<BalanceAllowanceResponse>(
      "GET",
      `/balance-allowance`,
      {
        params: { token_id: tokenId, address },
        requiresAuth: true,
      },
    );
  }
}

export type BalanceAllowanceResponse = {
  balance: string;
  allowance: string;
};

import type { BaseClient } from "../client/base.js";

export class MiscApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get open interest
   */
  async getOpenInterest(market?: string): Promise<GetMarketOpenInterest[]> {
    return this.client.request<GetMarketOpenInterest[]>({
      method: "GET",
      path: "/oi",
      params: { market },
    });
  }

  /**
   * Get live volume for an event
   */
  async getEventLiveVolume(eventId: number): Promise<GetEventLiveVolume> {
    return this.client.request<GetEventLiveVolume>({
      method: "GET",
      path: "/live-volume",
      params: { id: eventId },
    });
  }
}

export type GetMarketOpenInterest = {
  market: string;
  value: string;
};

export type GetEventLiveVolume = {
  total: number;
  markets: {
    market: string;
    value: string;
  }[];
};

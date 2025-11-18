import type { BaseClient } from "../client/base.js";

export class SportApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * List all sports metadata
   * Returns comprehensive metadata for sports including tag IDs, images, resolution sources, and series information
   */
  async list(): Promise<SportsMetadata[]> {
    return this.client.request<SportsMetadata[]>({
      method: "GET",
      path: "/sports",
    });
  }

  /**
   * List sports metadata by sport identifier
   */
  async listBySport(sport: string): Promise<SportsMetadata | undefined> {
    const allSports = await this.list();
    return allSports.find((s) => s.sport === sport);
  }

  /**
   * List sports metadata by tag ID
   * Returns all sports that contain the specified tag ID
   */
  async listByTag(tagId: string): Promise<SportsMetadata[]> {
    const allSports = await this.list();
    return allSports.filter((s) => s.tags?.includes(tagId));
  }

  /**
   * List sports metadata by series identifier
   * Returns all sports that match the specified series
   */
  async listBySeries(series: string): Promise<SportsMetadata[]> {
    const allSports = await this.list();
    return allSports.filter((s) => s.series === series);
  }
}

export type SportsMetadata = {
  /** The sport identifier or abbreviation */
  sport: string;

  /** URL to the sport's logo or image asset */
  image?: string;

  /** URL to the official resolution source for the sport */
  resolution?: string;

  /** Preferred ordering for sport display, typically 'home' or 'away' */
  ordering?: string;

  /** Comma-separated list of tag IDs associated with the sport for categorization and filtering */
  tags?: string;

  /** Series identifier linking the sport to a specific tournament or season */
  series?: string;
};

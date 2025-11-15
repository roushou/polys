import type { GammaBaseClient } from "../client/base.js";

export class CommentsApi {
  constructor(private readonly client: GammaBaseClient) {}

  /**
   * List comments with pagination and filtering
   */
  async list(params?: ListCommentsParams): Promise<Comment[]> {
    return this.client.request<Comment[]>({
      method: "GET",
      path: "/comments",
      params: {
        limit: params?.limit,
        offset: params?.offset,
        order: params?.order,
        ascending: params?.ascending,
        parent_entity_type: params?.parentEntityType,
        parent_entity_id: params?.parentEntityId,
        get_positions: params?.getPositions,
        holders_only: params?.holdersOnly,
      },
    });
  }

  /**
   * List comments for a specific event
   */
  async listByEvent(
    eventId: number,
    params?: {
      limit?: number;
      offset?: number;
      getPositions?: boolean;
      holdersOnly?: boolean;
    },
  ): Promise<Comment[]> {
    return this.list({
      ...params,
      parentEntityType: "Event",
      parentEntityId: eventId,
    });
  }

  /**
   * List comments for a specific series
   */
  async listBySeries(
    seriesId: number,
    params?: {
      limit?: number;
      offset?: number;
      getPositions?: boolean;
      holdersOnly?: boolean;
    },
  ): Promise<Comment[]> {
    return this.list({
      ...params,
      parentEntityType: "Series",
      parentEntityId: seriesId,
    });
  }

  /**
   * List comments for a specific market
   */
  async listByMarket(
    marketId: number,
    params?: {
      limit?: number;
      offset?: number;
      getPositions?: boolean;
      holdersOnly?: boolean;
    },
  ): Promise<Comment[]> {
    return this.list({
      ...params,
      parentEntityType: "market",
      parentEntityId: marketId,
    });
  }
}

export type ListCommentsParams = {
  /** Maximum number of comments to return */
  limit?: number;

  /** Offset for pagination */
  offset?: number;

  /** Comma-separated list of fields to order by */
  order?: string;

  /** Sort direction (true for ascending, false for descending) */
  ascending?: boolean;

  /** Filter by parent entity type (Event, Series, or market) */
  parentEntityType?: "Event" | "Series" | "market";

  /** Filter by parent entity ID */
  parentEntityId?: number;

  /** Include position data */
  getPositions?: boolean;

  /** Restrict to position holders only */
  holdersOnly?: boolean;
};

export type Comment = {
  /** Comment ID */
  id: string;

  /** Comment body text */
  body?: string;

  /** Parent entity type (Event, Series, or market) */
  parentEntityType?: string;

  /** Parent entity ID */
  parentEntityID?: number;

  /** Parent comment ID (for replies) */
  parentCommentID?: string;

  /** User address who created the comment */
  userAddress?: string;

  /** Address of user being replied to */
  replyAddress?: string;

  /** Created at timestamp */
  createdAt?: string;

  /** Updated at timestamp */
  updatedAt?: string;

  /** Number of reports */
  reportCount?: number;

  /** Number of reactions */
  reactionCount?: number;

  /** Author profile information */
  profile?: CommentProfile;

  /** Reactions to this comment */
  reactions?: Reaction[];
};

export type CommentProfile = {
  /** User address */
  userAddress?: string;

  /** Display name */
  name?: string;

  /** Bio text */
  bio?: string;

  /** Whether user is a moderator */
  moderator?: boolean;

  /** Whether user is the creator */
  creator?: boolean;

  /** Profile image URL */
  profileImage?: string;

  /** Optimized profile image data */
  profileImageOptimized?: {
    /** Image URL */
    url?: string;

    /** Image width */
    width?: number;

    /** Image height */
    height?: number;
  };

  /** User's positions (token holdings) */
  positions?: Array<{
    /** Token ID */
    tokenId?: string;

    /** Position size */
    positionSize?: string;
  }>;
};

export type Reaction = {
  /** Reaction ID */
  id?: string;

  /** Reaction type */
  type?: string;

  /** Reaction icon */
  icon?: string;

  /** User who reacted */
  userAddress?: string;

  /** User profile */
  profile?: {
    /** User address */
    userAddress?: string;

    /** Display name */
    name?: string;

    /** Profile image URL */
    profileImage?: string;
  };

  /** Created at timestamp */
  createdAt?: string;
};

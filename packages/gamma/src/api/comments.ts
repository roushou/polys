import { v, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";

export class CommentsApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * List comments with pagination and filtering
   */
  async list(params?: ListCommentsParams): Promise<Comment[]> {
    const validated = params ? validate(ListCommentsSchema, params) : undefined;

    return this.client.request<Comment[]>({
      method: "GET",
      path: "/comments",
      params: validated
        ? {
            limit: validated.limit,
            offset: validated.offset,
            order: validated.order,
            ascending: validated.ascending,
            parent_entity_type: validated.parentEntityType,
            parent_entity_id: validated.parentEntityId,
            get_positions: validated.getPositions,
            holders_only: validated.holdersOnly,
          }
        : undefined,
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

const ListCommentsSchema = v.pipe(
  v.object({
    limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    order: v.optional(v.string()),
    ascending: v.optional(v.boolean()),
    parentEntityType: v.optional(v.picklist(["Event", "Series", "market"])),
    parentEntityId: v.optional(v.number()),
    getPositions: v.optional(v.boolean()),
    holdersOnly: v.optional(v.boolean()),
  }),
  v.metadata({ title: "ListCommentsParams" }),
);

export type ListCommentsParams = v.InferInput<typeof ListCommentsSchema>;

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

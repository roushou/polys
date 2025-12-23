import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import type { MarketApi } from "./market.js";
import { OrderApi } from "./order.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("OrderApi Input Validation", () => {
  const mockMarketApi = {} as MarketApi;
  const api = new OrderApi(mockClient, mockMarketApi);

  describe("getOrder", () => {
    test("should reject empty id", () => {
      expect(api.getOrder("")).rejects.toThrow(ValidationError);
    });
  });

  describe("listOrders", () => {
    test("should reject empty marketId", () => {
      expect(api.listOrders({ marketId: "" })).rejects.toThrow(ValidationError);
    });
  });

  describe("checkOrderRewardScoring", () => {
    test("should reject empty id", () => {
      expect(api.checkOrderRewardScoring("")).rejects.toThrow(ValidationError);
    });
  });

  describe("cancelOrder", () => {
    test("should reject empty id", () => {
      expect(api.cancelOrder("")).rejects.toThrow(ValidationError);
    });
  });

  describe("cancelOrders", () => {
    test("should reject empty array", () => {
      expect(api.cancelOrders([])).rejects.toThrow(ValidationError);
    });

    test("should reject array with empty strings", () => {
      expect(api.cancelOrders(["order1", ""])).rejects.toThrow(ValidationError);
    });
  });

  describe("createOrder", () => {
    test("should reject empty tokenId", () => {
      expect(
        api.createOrder({
          tokenId: "",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject zero price", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject negative price", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: -1,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject zero size", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 0,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid side", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "HOLD" as "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject negative expiration", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: -1,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid taker address", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "invalid",
        }),
      ).rejects.toThrow(ValidationError);
    });
  });
});

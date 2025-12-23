import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { MarketApi } from "./market.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("MarketApi Input Validation", () => {
  const api = new MarketApi(mockClient);

  describe("get", () => {
    test("should reject empty conditionId", () => {
      expect(api.get("")).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only conditionId", () => {
      expect(api.get("   ")).rejects.toThrow(ValidationError);
    });
  });

  describe("getPrice", () => {
    test("should reject empty tokenId", () => {
      expect(api.getPrice("", "BUY")).rejects.toThrow(ValidationError);
    });

    test("should reject invalid side", () => {
      expect(api.getPrice("token123", "INVALID" as "BUY")).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe("getMidpoint", () => {
    test("should reject empty tokenId", () => {
      expect(api.getMidpoint("")).rejects.toThrow(ValidationError);
    });
  });

  describe("getTickSize", () => {
    test("should reject empty tokenId", () => {
      expect(api.getTickSize("")).rejects.toThrow(ValidationError);
    });
  });

  describe("getFeeRateBps", () => {
    test("should reject empty tokenId", () => {
      expect(api.getFeeRateBps("")).rejects.toThrow(ValidationError);
    });
  });

  describe("getPriceHistory", () => {
    test("should reject empty market", () => {
      expect(api.getPriceHistory({ market: "" })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject invalid interval", () => {
      expect(
        api.getPriceHistory({
          market: "market123",
          interval: "invalid" as "1d",
        }),
      ).rejects.toThrow(ValidationError);
    });
  });
});

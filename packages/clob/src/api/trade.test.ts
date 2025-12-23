import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { TradeApi } from "./trade.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("TradeApi Input Validation", () => {
  const api = new TradeApi(mockClient);

  describe("listAllTrades", () => {
    test("should reject empty market string", () => {
      expect(api.listAllTrades("")).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only market string", () => {
      expect(api.listAllTrades("   ")).rejects.toThrow(ValidationError);
    });
  });

  describe("listTrades", () => {
    test("should reject invalid limit (negative)", () => {
      expect(api.listTrades({ limit: -1 })).rejects.toThrow(ValidationError);
    });

    test("should reject invalid limit (non-integer)", () => {
      expect(api.listTrades({ limit: 1.5 })).rejects.toThrow(ValidationError);
    });
  });
});

import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { BookApi } from "./book.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("BookApi Input Validation", () => {
  const api = new BookApi(mockClient);

  describe("getOrderBook", () => {
    test("should reject empty tokenId", () => {
      expect(api.getOrderBook("")).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only tokenId", () => {
      expect(api.getOrderBook("   ")).rejects.toThrow(ValidationError);
    });
  });

  describe("getOrderBooks", () => {
    test("should reject empty array", () => {
      expect(api.getOrderBooks([])).rejects.toThrow(ValidationError);
    });

    test("should reject items with empty tokenId", () => {
      expect(api.getOrderBooks([{ tokenId: "", side: "BUY" }])).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject items with invalid side", () => {
      expect(
        api.getOrderBooks([{ tokenId: "token123", side: "HOLD" as "BUY" }]),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("getTicker", () => {
    test("should reject empty tokenId", () => {
      expect(api.getTicker("")).rejects.toThrow(ValidationError);
    });
  });
});

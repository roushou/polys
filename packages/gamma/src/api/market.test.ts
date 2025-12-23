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
    test("should reject empty id", () => {
      expect(api.get("")).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only id", () => {
      expect(api.get("   ")).rejects.toThrow(ValidationError);
    });
  });

  describe("listAll", () => {
    test("should reject negative limit", () => {
      expect(
        api.listAll({
          active: true,
          closed: false,
          archived: false,
          limit: -1,
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject negative offset", () => {
      expect(
        api.listAll({
          active: true,
          closed: false,
          archived: false,
          offset: -1,
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("listCurrent", () => {
    test("should reject negative limit", () => {
      expect(api.listCurrent({ limit: -1 })).rejects.toThrow(ValidationError);
    });

    test("should reject negative offset", () => {
      expect(api.listCurrent({ offset: -1 })).rejects.toThrow(ValidationError);
    });
  });
});

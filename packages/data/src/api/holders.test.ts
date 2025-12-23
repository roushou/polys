import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { HoldersApi } from "./holders.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("HoldersApi Input Validation", () => {
  const api = new HoldersApi(mockClient);

  describe("listHolders", () => {
    test("should reject empty market", () => {
      expect(api.listHolders({ market: "" })).rejects.toThrow(ValidationError);
    });

    test("should reject negative limit", () => {
      expect(
        api.listHolders({ market: "market123", limit: -1 }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject limit over max", () => {
      expect(
        api.listHolders({ market: "market123", limit: 501 }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject negative minBalance", () => {
      expect(
        api.listHolders({ market: "market123", minBalance: -1 }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject minBalance over max", () => {
      expect(
        api.listHolders({ market: "market123", minBalance: 1000000 }),
      ).rejects.toThrow(ValidationError);
    });
  });
});

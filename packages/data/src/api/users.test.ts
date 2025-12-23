import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { UsersApi } from "./users.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("UsersApi Input Validation", () => {
  const api = new UsersApi(mockClient);

  describe("positions", () => {
    test("should reject empty user", () => {
      expect(api.positions({ user: "" })).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only user", () => {
      expect(api.positions({ user: "   " })).rejects.toThrow(ValidationError);
    });

    test("should reject negative limit", () => {
      expect(api.positions({ user: "user123", limit: -1 })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject limit over max", () => {
      expect(api.positions({ user: "user123", limit: 501 })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject negative offset", () => {
      expect(api.positions({ user: "user123", offset: -1 })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject invalid sortBy", () => {
      expect(
        api.positions({ user: "user123", sortBy: "INVALID" as "TOKENS" }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid sortDirection", () => {
      expect(
        api.positions({ user: "user123", sortDirection: "UP" as "ASC" }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("listTrades", () => {
    test("should reject negative limit", () => {
      expect(api.listTrades({ limit: -1 })).rejects.toThrow(ValidationError);
    });

    test("should reject limit over max", () => {
      expect(api.listTrades({ limit: 10001 })).rejects.toThrow(ValidationError);
    });

    test("should reject invalid side", () => {
      expect(api.listTrades({ side: "HOLD" as "BUY" })).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe("listActivity", () => {
    test("should reject empty user", () => {
      expect(api.listActivity({ user: "" })).rejects.toThrow(ValidationError);
    });

    test("should reject negative limit", () => {
      expect(api.listActivity({ user: "user123", limit: -1 })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject invalid sortBy", () => {
      expect(
        api.listActivity({ user: "user123", sortBy: "INVALID" as "TIMESTAMP" }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("listPositionsValues", () => {
    test("should reject empty user", () => {
      expect(api.listPositionsValues({ user: "" })).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe("listClosedPositions", () => {
    test("should reject empty user", () => {
      expect(api.listClosedPositions({ user: "" })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject negative limit", () => {
      expect(
        api.listClosedPositions({ user: "user123", limit: -1 }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject limit over max", () => {
      expect(
        api.listClosedPositions({ user: "user123", limit: 51 }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid sortBy", () => {
      expect(
        api.listClosedPositions({
          user: "user123",
          sortBy: "INVALID" as "REALIZEDPNL",
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("getTradedMarkets", () => {
    test("should reject empty user", () => {
      expect(api.getTradedMarkets("")).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only user", () => {
      expect(api.getTradedMarkets("   ")).rejects.toThrow(ValidationError);
    });
  });
});

import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { BuildersApi } from "./builders.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("BuildersApi Input Validation", () => {
  const api = new BuildersApi(mockClient);

  describe("leaderboard", () => {
    test("should reject invalid timePeriod", () => {
      expect(api.leaderboard({ timePeriod: "year" as "day" })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject negative limit", () => {
      expect(api.leaderboard({ timePeriod: "day", limit: -1 })).rejects.toThrow(
        ValidationError,
      );
    });

    test("should reject negative offset", () => {
      expect(
        api.leaderboard({ timePeriod: "day", offset: -1 }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("volume", () => {
    test("should reject invalid timePeriod", () => {
      expect(api.volume("year" as "day")).rejects.toThrow(ValidationError);
    });
  });
});

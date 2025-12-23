import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { CommentsApi } from "./comments.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("CommentsApi Input Validation", () => {
  const api = new CommentsApi(mockClient);

  describe("list", () => {
    test("should reject negative limit", () => {
      expect(api.list({ limit: -1 })).rejects.toThrow(ValidationError);
    });

    test("should reject negative offset", () => {
      expect(api.list({ offset: -1 })).rejects.toThrow(ValidationError);
    });

    test("should reject invalid parentEntityType", () => {
      expect(
        api.list({ parentEntityType: "Invalid" as "Event" }),
      ).rejects.toThrow(ValidationError);
    });
  });
});

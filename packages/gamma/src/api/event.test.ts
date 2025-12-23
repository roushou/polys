import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { EventApi } from "./event.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("EventApi Input Validation", () => {
  const api = new EventApi(mockClient);

  describe("getById", () => {
    test("should reject empty id", () => {
      expect(api.getById("")).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only id", () => {
      expect(api.getById("   ")).rejects.toThrow(ValidationError);
    });
  });

  describe("getBySlug", () => {
    test("should reject empty slug", () => {
      expect(api.getBySlug("")).rejects.toThrow(ValidationError);
    });
  });

  describe("list", () => {
    test("should reject negative limit", () => {
      expect(
        api.list({ active: true, closed: false, limit: -1 }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject non-integer limit", () => {
      expect(
        api.list({ active: true, closed: false, limit: 1.5 }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject negative offset", () => {
      expect(
        api.list({ active: true, closed: false, offset: -1 }),
      ).rejects.toThrow(ValidationError);
    });
  });
});

import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { SeriesApi } from "./series.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("SeriesApi Input Validation", () => {
  const api = new SeriesApi(mockClient);

  describe("get", () => {
    test("should reject empty id", () => {
      expect(api.get({ id: "", includeChat: false })).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe("list", () => {
    test("should reject negative limit", () => {
      expect(api.list({ limit: -1 })).rejects.toThrow(ValidationError);
    });

    test("should reject negative offset", () => {
      expect(api.list({ offset: -1 })).rejects.toThrow(ValidationError);
    });
  });

  describe("listByCategory", () => {
    test("should reject empty categoryLabel", () => {
      expect(api.listByCategory("")).rejects.toThrow(ValidationError);
    });

    test("should reject whitespace-only categoryLabel", () => {
      expect(api.listByCategory("   ")).rejects.toThrow(ValidationError);
    });
  });
});

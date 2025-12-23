import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { TagsApi } from "./tags.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("TagsApi Input Validation", () => {
  const api = new TagsApi(mockClient);

  describe("getBySlug", () => {
    test("should reject empty slug", () => {
      expect(
        api.getBySlug({ slug: "", includeTemplate: false }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("getById", () => {
    test("should reject empty id", () => {
      expect(api.getById({ id: "", includeTemplate: false })).rejects.toThrow(
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

  describe("listRelatedTagsById", () => {
    test("should reject empty id", () => {
      expect(
        api.listRelatedTagsById({ id: "", omitEmpty: false, status: "all" }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid status", () => {
      expect(
        api.listRelatedTagsById({
          id: "tag123",
          omitEmpty: false,
          status: "invalid" as "all",
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("listRelatedTagsBySlug", () => {
    test("should reject empty slug", () => {
      expect(
        api.listRelatedTagsBySlug({
          slug: "",
          omitEmpty: false,
          status: "all",
        }),
      ).rejects.toThrow(ValidationError);
    });
  });
});

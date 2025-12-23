import { ValidationError } from "@dicedhq/core";
import { describe, expect, test } from "bun:test";
import type { BaseClient } from "../client/base.js";
import { MiscApi } from "./misc.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("MiscApi Input Validation", () => {
  const api = new MiscApi(mockClient);

  describe("getEventLiveVolume", () => {
    test("should reject negative eventId", () => {
      expect(api.getEventLiveVolume(-1)).rejects.toThrow(ValidationError);
    });

    test("should reject non-integer eventId", () => {
      expect(api.getEventLiveVolume(1.5)).rejects.toThrow(ValidationError);
    });
  });
});

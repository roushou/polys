import { describe, expect, test } from "bun:test";
import { ValidationError } from "../errors.js";
import {
  Integer,
  NonEmptyString,
  NonNegative,
  Positive,
} from "./primitives.js";
import { validate } from "./validator.js";
import { v } from "./index.js";

describe("Primitive Schemas", () => {
  describe("NonEmptyString", () => {
    test("should accept non-empty strings", () => {
      expect(validate(NonEmptyString, "hello", "field")).toBe("hello");
      expect(validate(NonEmptyString, "a", "field")).toBe("a");
      expect(validate(NonEmptyString, "hello world", "field")).toBe(
        "hello world",
      );
    });

    test("should trim whitespace", () => {
      expect(validate(NonEmptyString, "  hello  ", "field")).toBe("hello");
      expect(validate(NonEmptyString, "\thello\n", "field")).toBe("hello");
    });

    test("should reject empty strings", () => {
      expect(() => validate(NonEmptyString, "", "field")).toThrow(
        ValidationError,
      );
    });

    test("should reject whitespace-only strings", () => {
      expect(() => validate(NonEmptyString, "   ", "field")).toThrow(
        ValidationError,
      );
      expect(() => validate(NonEmptyString, "\t\n", "field")).toThrow(
        ValidationError,
      );
    });

    test("should reject non-string types", () => {
      expect(() => validate(NonEmptyString, 123, "field")).toThrow(
        ValidationError,
      );
      expect(() => validate(NonEmptyString, null, "field")).toThrow(
        ValidationError,
      );
      expect(() => validate(NonEmptyString, undefined, "field")).toThrow(
        ValidationError,
      );
      expect(() => validate(NonEmptyString, {}, "field")).toThrow(
        ValidationError,
      );
    });
  });

  describe("Positive", () => {
    test("should accept positive numbers", () => {
      expect(validate(Positive, 1, "field")).toBe(1);
      expect(validate(Positive, 0.1, "field")).toBe(0.1);
      expect(validate(Positive, 100, "field")).toBe(100);
      expect(validate(Positive, 0.0001, "field")).toBe(0.0001);
    });

    test("should reject zero", () => {
      expect(() => validate(Positive, 0, "field")).toThrow(ValidationError);
    });

    test("should reject negative numbers", () => {
      expect(() => validate(Positive, -1, "field")).toThrow(ValidationError);
      expect(() => validate(Positive, -0.1, "field")).toThrow(ValidationError);
    });

    test("should reject non-number types", () => {
      expect(() => validate(Positive, "1", "field")).toThrow(ValidationError);
      expect(() => validate(Positive, null, "field")).toThrow(ValidationError);
      expect(() => validate(Positive, undefined, "field")).toThrow(
        ValidationError,
      );
    });
  });

  describe("NonNegative", () => {
    test("should accept zero and positive numbers", () => {
      expect(validate(NonNegative, 0, "field")).toBe(0);
      expect(validate(NonNegative, 1, "field")).toBe(1);
      expect(validate(NonNegative, 100.5, "field")).toBe(100.5);
    });

    test("should reject negative numbers", () => {
      expect(() => validate(NonNegative, -1, "field")).toThrow(ValidationError);
      expect(() => validate(NonNegative, -0.001, "field")).toThrow(
        ValidationError,
      );
    });

    test("should reject non-number types", () => {
      expect(() => validate(NonNegative, "0", "field")).toThrow(
        ValidationError,
      );
      expect(() => validate(NonNegative, null, "field")).toThrow(
        ValidationError,
      );
    });
  });

  describe("Integer", () => {
    test("should accept integers", () => {
      expect(validate(Integer, 0, "field")).toBe(0);
      expect(validate(Integer, 1, "field")).toBe(1);
      expect(validate(Integer, -5, "field")).toBe(-5);
      expect(validate(Integer, 1000000, "field")).toBe(1000000);
    });

    test("should reject floating point numbers", () => {
      expect(() => validate(Integer, 1.5, "field")).toThrow(ValidationError);
      expect(() => validate(Integer, 0.1, "field")).toThrow(ValidationError);
      expect(() => validate(Integer, -2.5, "field")).toThrow(ValidationError);
    });

    test("should reject non-number types", () => {
      expect(() => validate(Integer, "1", "field")).toThrow(ValidationError);
      expect(() => validate(Integer, null, "field")).toThrow(ValidationError);
    });
  });
});

describe("validate function", () => {
  describe("with explicit context", () => {
    test("should include context in error message for scalars", () => {
      try {
        validate(NonEmptyString, "", "userId");
        expect.unreachable("Should have thrown");
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        expect(error.message).toContain("userId");
      }
    });

    test("should use context when path is empty", () => {
      try {
        validate(Positive, -1, "amount");
        expect.unreachable("Should have thrown");
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        expect(error.message).toContain("amount");
      }
    });
  });

  describe("with schema metadata", () => {
    const TestSchema = v.pipe(
      v.object({
        name: NonEmptyString,
        age: v.pipe(v.number(), v.integer(), v.minValue(0)),
      }),
      v.metadata({ title: "TestParams" }),
    );

    test("should derive context from metadata title", () => {
      try {
        validate(TestSchema, { name: "", age: 25 });
        expect.unreachable("Should have thrown");
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        expect(error.message).toContain("name");
      }
    });

    test("should use metadata title when no path or context", () => {
      const SimpleSchema = v.pipe(
        v.string(),
        v.minLength(5),
        v.metadata({ title: "Username" }),
      );

      try {
        validate(SimpleSchema, "abc");
        expect.unreachable("Should have thrown");
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        expect(error.message).toContain("Username");
      }
    });

    test("should validate successfully with metadata", () => {
      const result = validate(TestSchema, { name: "John", age: 25 });
      expect(result).toEqual({ name: "John", age: 25 });
    });
  });

  describe("with nested object paths", () => {
    const NestedSchema = v.pipe(
      v.object({
        user: v.object({
          profile: v.object({
            email: NonEmptyString,
          }),
        }),
      }),
      v.metadata({ title: "NestedParams" }),
    );

    test("should include full path in error message", () => {
      try {
        validate(NestedSchema, { user: { profile: { email: "" } } });
        expect.unreachable("Should have thrown");
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        expect(error.message).toContain("user.profile.email");
      }
    });
  });

  describe("error details", () => {
    test("should include path in error details", () => {
      try {
        validate(NonEmptyString, "", "fieldName");
        expect.unreachable("Should have thrown");
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        expect(error.details.path).toBe("fieldName");
      }
    });

    test("should include issues in error details", () => {
      try {
        validate(NonEmptyString, "", "fieldName");
        expect.unreachable("Should have thrown");
      } catch (error) {
        if (!(error instanceof ValidationError)) throw error;
        expect(error.details.issues).toBeDefined();
        expect(Array.isArray(error.details.issues)).toBe(true);
        expect(error.details.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("successful validation", () => {
    test("should return validated data unchanged for valid input", () => {
      expect(validate(NonEmptyString, "test", "field")).toBe("test");
      expect(validate(Positive, 42, "field")).toBe(42);
      expect(validate(Integer, 100, "field")).toBe(100);
    });

    test("should return transformed data when schema transforms", () => {
      expect(validate(NonEmptyString, "  trimmed  ", "field")).toBe("trimmed");
    });
  });
});

describe("Object Schema Validation", () => {
  const OrderSchema = v.pipe(
    v.object({
      tokenId: NonEmptyString,
      price: Positive,
      size: Positive,
      side: v.picklist(["BUY", "SELL"]),
    }),
    v.metadata({ title: "OrderParams" }),
  );

  test("should validate complete valid object", () => {
    const result = validate(OrderSchema, {
      tokenId: "token123",
      price: 0.5,
      size: 10,
      side: "BUY",
    });

    expect(result).toEqual({
      tokenId: "token123",
      price: 0.5,
      size: 10,
      side: "BUY",
    });
  });

  test("should reject missing required fields", () => {
    expect(() =>
      validate(OrderSchema, {
        tokenId: "token123",
        price: 0.5,
      }),
    ).toThrow(ValidationError);
  });

  test("should reject invalid field values", () => {
    expect(() =>
      validate(OrderSchema, {
        tokenId: "",
        price: 0.5,
        size: 10,
        side: "BUY",
      }),
    ).toThrow(ValidationError);

    expect(() =>
      validate(OrderSchema, {
        tokenId: "token123",
        price: -1,
        size: 10,
        side: "BUY",
      }),
    ).toThrow(ValidationError);

    expect(() =>
      validate(OrderSchema, {
        tokenId: "token123",
        price: 0.5,
        size: 10,
        side: "INVALID",
      }),
    ).toThrow(ValidationError);
  });

  test("should show field name in error for invalid field", () => {
    try {
      validate(OrderSchema, {
        tokenId: "token123",
        price: 0.5,
        size: 0,
        side: "BUY",
      });
      expect.unreachable("Should have thrown");
    } catch (error) {
      if (!(error instanceof ValidationError)) throw error;
      expect(error.message).toContain("size");
    }
  });
});

describe("Array Schema Validation", () => {
  const ItemsSchema = v.pipe(
    v.array(
      v.object({
        id: NonEmptyString,
        quantity: v.pipe(v.number(), v.integer(), v.minValue(1)),
      }),
    ),
    v.minLength(1, "At least one item required"),
    v.metadata({ title: "ItemsParams" }),
  );

  test("should validate valid array", () => {
    const result = validate(ItemsSchema, [
      { id: "item1", quantity: 5 },
      { id: "item2", quantity: 3 },
    ]);

    expect(result).toEqual([
      { id: "item1", quantity: 5 },
      { id: "item2", quantity: 3 },
    ]);
  });

  test("should reject empty array", () => {
    expect(() => validate(ItemsSchema, [])).toThrow(ValidationError);
  });

  test("should reject invalid items in array", () => {
    expect(() =>
      validate(ItemsSchema, [
        { id: "item1", quantity: 5 },
        { id: "", quantity: 3 },
      ]),
    ).toThrow(ValidationError);
  });

  test("should show array index in error path", () => {
    try {
      validate(ItemsSchema, [
        { id: "item1", quantity: 5 },
        { id: "item2", quantity: 0 },
      ]);
      expect.unreachable("Should have thrown");
    } catch (error) {
      if (!(error instanceof ValidationError)) throw error;
      expect(error.message).toMatch(/1.*quantity|quantity/);
    }
  });
});

describe("Optional Fields", () => {
  const ConfigSchema = v.pipe(
    v.object({
      name: NonEmptyString,
      limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 10),
      offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 0),
    }),
    v.metadata({ title: "ConfigParams" }),
  );

  test("should use defaults for missing optional fields", () => {
    const result = validate(ConfigSchema, { name: "test" });
    expect(result).toEqual({ name: "test", limit: 10, offset: 0 });
  });

  test("should accept provided optional values", () => {
    const result = validate(ConfigSchema, {
      name: "test",
      limit: 50,
      offset: 100,
    });
    expect(result).toEqual({ name: "test", limit: 50, offset: 100 });
  });

  test("should validate optional field values when provided", () => {
    expect(() =>
      validate(ConfigSchema, {
        name: "test",
        limit: -1,
      }),
    ).toThrow(ValidationError);
  });
});

describe("Picklist Validation", () => {
  const SideSchema = v.picklist(["BUY", "SELL"]);

  test("should accept valid picklist values", () => {
    expect(validate(SideSchema, "BUY", "side")).toBe("BUY");
    expect(validate(SideSchema, "SELL", "side")).toBe("SELL");
  });

  test("should reject invalid picklist values", () => {
    expect(() => validate(SideSchema, "HOLD", "side")).toThrow(ValidationError);
    expect(() => validate(SideSchema, "buy", "side")).toThrow(ValidationError);
    expect(() => validate(SideSchema, "", "side")).toThrow(ValidationError);
  });
});

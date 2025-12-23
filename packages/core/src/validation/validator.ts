import * as v from "valibot";
import { ValidationError } from "../errors.js";

// ============================================================================
// Schema Helpers
// ============================================================================

/** Creates a range schema (inclusive) */
export function range(min: number, max: number) {
  return v.pipe(
    v.number(),
    v.minValue(min, `Value must be at least ${min}`),
    v.maxValue(max, `Value must be at most ${max}`),
  );
}

/** Creates a pagination schema with limit and offset */
export function pagination(maxLimit: number, maxOffset: number) {
  return v.object({
    limit: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(0),
        v.maxValue(maxLimit, `limit must be at most ${maxLimit}`),
      ),
    ),
    offset: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(0),
        v.maxValue(maxOffset, `offset must be at most ${maxOffset}`),
      ),
    ),
  });
}

/** Order side enum schema */
export const OrderSide = v.picklist(["BUY", "SELL"]);

// ============================================================================
// Validation Helper
// ============================================================================

/**
 * Validates data against a schema, throwing ValidationError on failure
 *
 * @param schema - Valibot schema to validate against (use v.metadata() for auto-context)
 * @param data - Data to validate
 * @param context - Optional context for error messages (auto-derived from v.metadata())
 * @returns Validated and typed data
 * @throws ValidationError if validation fails
 *
 * @example
 * // With v.metadata() (recommended):
 * const UserSchema = v.pipe(v.object({...}), v.metadata({ title: "User" }));
 * validate(UserSchema, data); // Context auto-derived as "User"
 *
 * // With explicit context:
 * validate(v.string(), id, "id");
 */
export function validate<T>(
  schema: v.GenericSchema<T>,
  data: unknown,
  context?: string,
): T {
  const result = v.safeParse(schema, data);
  if (!result.success) {
    const issue = result.issues[0];
    const metadata = v.getMetadata(schema);
    const path =
      issue.path?.map((p) => p.key).join(".") ||
      context ||
      (metadata.title as string | undefined) ||
      "value";
    throw new ValidationError(`${path}: ${issue.message}`, {
      path,
      issues: result.issues,
    });
  }
  return result.output;
}

/**
 * Creates a validator function for a specific schema
 * Useful for reusing validation logic across methods
 */
export function createValidator<T>(schema: v.GenericSchema<T>) {
  return (data: unknown, context?: string): T =>
    validate(schema, data, context);
}

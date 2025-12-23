import * as v from "valibot";

/** Non-empty string schema */
export const NonEmptyString = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Value is required and cannot be empty"),
);

/** Positive number schema (> 0) */
export const Positive = v.pipe(
  v.number(),
  v.minValue(0, "Value must be positive"),
  v.check((n) => n > 0, "Value must be positive"),
);

/** Non-negative number schema (>= 0) */
export const NonNegative = v.pipe(
  v.number(),
  v.minValue(0, "Value must be non-negative"),
);

/** Integer schema */
export const Integer = v.pipe(
  v.number(),
  v.integer("Value must be an integer"),
);

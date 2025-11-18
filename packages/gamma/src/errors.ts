/**
 * Base error class for order book client errors
 */
export class GammaError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "GammaError";
    Object.setPrototypeOf(this, GammaError.prototype);
  }
}

/**
 * Error thrown when API request fails
 */
export class ApiError extends GammaError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, details);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends GammaError {
  constructor(message: string, details?: unknown) {
    super(message, 401, details);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error thrown when request validation fails
 */
export class ValidationError extends GammaError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends GammaError {
  constructor(message: string, details?: unknown) {
    super(message, 429, details);
    this.name = "RateLimitError";
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Error thrown when request times out
 */
export class TimeoutError extends GammaError {
  constructor(message: string, details?: unknown) {
    super(message, 408, details);
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends GammaError {
  constructor(message: string, details?: unknown) {
    super(message, undefined, details);
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

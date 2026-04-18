export class AperturError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = "AperturError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class RateLimitError extends AperturError {
  public readonly retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(429, message, "RATE_LIMIT");
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class NotFoundError extends AperturError {
  constructor(message: string = "Not found") {
    super(404, message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends AperturError {
  constructor(message: string = "Authentication failed") {
    super(401, message, "AUTHENTICATION_FAILED");
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends AperturError {
  constructor(message: string) {
    super(400, message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

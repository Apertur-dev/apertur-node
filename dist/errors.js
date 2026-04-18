"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.AuthenticationError = exports.NotFoundError = exports.RateLimitError = exports.AperturError = void 0;
class AperturError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code) {
        super(message);
        this.name = "AperturError";
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.AperturError = AperturError;
class RateLimitError extends AperturError {
    retryAfter;
    constructor(message, retryAfter) {
        super(429, message, "RATE_LIMIT");
        this.name = "RateLimitError";
        this.retryAfter = retryAfter;
    }
}
exports.RateLimitError = RateLimitError;
class NotFoundError extends AperturError {
    constructor(message = "Not found") {
        super(404, message, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class AuthenticationError extends AperturError {
    constructor(message = "Authentication failed") {
        super(401, message, "AUTHENTICATION_FAILED");
        this.name = "AuthenticationError";
    }
}
exports.AuthenticationError = AuthenticationError;
class ValidationError extends AperturError {
    constructor(message) {
        super(400, message, "VALIDATION_ERROR");
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;

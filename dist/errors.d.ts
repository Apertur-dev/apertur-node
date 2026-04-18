export declare class AperturError extends Error {
    readonly statusCode: number;
    readonly code?: string;
    constructor(statusCode: number, message: string, code?: string);
}
export declare class RateLimitError extends AperturError {
    readonly retryAfter?: number;
    constructor(message: string, retryAfter?: number);
}
export declare class NotFoundError extends AperturError {
    constructor(message?: string);
}
export declare class AuthenticationError extends AperturError {
    constructor(message?: string);
}
export declare class ValidationError extends AperturError {
    constructor(message: string);
}

/**
 * Operational errors: expected failures (validation, not found, auth).
 * Use for control flow; they are not logged as critical.
 */
export class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}

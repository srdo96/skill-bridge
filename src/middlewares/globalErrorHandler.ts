import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";

    if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 400;
        errorMessage = "You provide incorrect field type or missing fields";
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            errorMessage = "Requested record not found";
        } else if (err.code === "P2002") {
            statusCode = 409;
            errorMessage =
                (err.meta?.driverAdapterError as any)?.cause?.originalMessage ||
                "Duplicate value violates unique constraint";
        } else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed";
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "An unknown database error occurred.";
    }
    res.status(statusCode);
    res.json({ success: false, message: errorMessage, error: err });
}

export default errorHandler;

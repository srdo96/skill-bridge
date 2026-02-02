import type { NextFunction, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import type { AuthenticatedRequest } from "../../middlewares/auth";
import { bookingService } from "./booking.service";

const createBooking = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.id;
        const bookingData = {
            ...req.body,
            student_id: userId,
        };
        const data = await bookingService.createBooking(bookingData);
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Booking created successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};
export const bookingController = { createBooking };

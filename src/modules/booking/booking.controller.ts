import type { NextFunction, Request, Response } from "express";
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

const getBookings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.id;
        const data = await bookingService.getBookings(userId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Bookings fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getBookingDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { bookingId } = req.params;
        if (!bookingId) throw new Error("Booking Id Required!");
        if (Array.isArray(bookingId)) throw new Error("Id Formant not valid");

        const data = await bookingService.getBookingDetails(bookingId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get Booking details successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const cancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { bookingId } = req.params;
        if (!bookingId) throw new Error("Booking Id Required!");
        if (Array.isArray(bookingId)) throw new Error("Id Formant not valid");

        const data = await bookingService.cancelBooking(bookingId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking cancelled successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const bookingController = {
    createBooking,
    getBookings,
    getBookingDetails,
    cancelBooking,
};

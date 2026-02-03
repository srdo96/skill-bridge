import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import { reviewService } from "./review.service";

const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user?.id;
        const body = { ...req.body, student_id: userId };

        const data = await reviewService.createReview(body);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Create Review Successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const reviewController = { createReview };

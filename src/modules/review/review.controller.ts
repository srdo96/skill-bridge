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
            statusCode: 201,
            success: true,
            message: "Create Review Successfully",
            data,
        });
    } catch (error) {
        console.log(error, "error");
        next(error);
    }
};

const getAllReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await reviewService.getAllReviews();
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get All Reviews Successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getReviewsDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { reviewId } = req.params;
        if (!reviewId) throw new Error("Review Id Required!");
        if (Array.isArray(reviewId)) throw new Error("Id Formant not valid");

        const data = await reviewService.getReviewDetails(reviewId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get Reviews Details Successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const reviewController = {
    createReview,
    getReviewsDetails,
    getAllReviews,
};

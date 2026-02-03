import type { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: Review) => {
    return await prisma.review.create({ data: payload });
};

const getReviewDetails = async (reviewId: string) => {
    return await prisma.review.findUniqueOrThrow({
        where: { review_id: reviewId },
    });
};

export const reviewService = { createReview, getReviewDetails };

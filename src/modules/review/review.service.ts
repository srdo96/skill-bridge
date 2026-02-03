import { BookingStatus, type Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: Review) => {
    return await prisma.$transaction(async (tx) => {
        await tx.booking.update({
            where: { booking_id: payload.booking_id },
            data: { status: BookingStatus.COMPLETED },
        });
        await tx.review.create({ data: payload });
    });
};

const getAllReviews = async () => {
    return await prisma.review.findMany();
};

const getReviewDetails = async (reviewId: string) => {
    return await prisma.review.findUniqueOrThrow({
        where: { review_id: reviewId },
    });
};

export const reviewService = { createReview, getReviewDetails, getAllReviews };

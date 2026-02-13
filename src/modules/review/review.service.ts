import { BookingStatus, type Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: Review) => {
    const reviewResult = await prisma.$transaction(async (tx) => {
        await tx.booking.update({
            where: { booking_id: payload.booking_id },
            data: { status: BookingStatus.COMPLETED },
        });
        return await tx.review.create({ data: payload });
    });

    const updateTutorProfile = await prisma.$transaction(async (tx) => {
        const avgRating = await tx.review.aggregate({
            where: { tutor_profile_id: payload.tutor_profile_id },
            _avg: { rating: true },
        });
        return await tx.tutorProfile.update({
            where: { tutor_profile_id: payload.tutor_profile_id },
            data: { avg_rating: avgRating._avg.rating || 0.0 },
        });
    });

    return {
        reviewResult,
        updateTutorProfile,
    };
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

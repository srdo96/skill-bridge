import type { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: Review) => {
    return await prisma.review.create({ data: payload });
};

export const reviewService = { createReview };

import type { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutorProfile = async (
    payload: Omit<
        TutorProfile,
        "tutor_profile_id" | "tutor_id" | "created_at" | "updated_at"
    >,
    tutorId: string,
) => {
    return await prisma.tutorProfile.create({
        data: { ...payload, tutor_id: tutorId },
    });
};

const updateTutorProfile = async (
    payload: Partial<TutorProfile>,
    tutorId: string,
) => {
    const profileData = await prisma.tutorProfile.create({
        data: { ...payload, tutor_id: tutorId, hourly_rate: 1, avg_rating: 1 },
    });
};

export const tutorProfileService = { createTutorProfile, updateTutorProfile };

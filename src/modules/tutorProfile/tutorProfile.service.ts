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

const getAllTutors = async ({ search }: { search: string | undefined }) => {
    // const andCondition: TutorProfileWhereInput[] = [];
    // if (search) {
    //     andCondition.push({
    //         OR: [{}],
    //     });
    // }
    return await prisma.tutorProfile.findMany({
        include: { tutor: true, tutorSubjects: true },
    });
};

const getTutorDetails = async (tutor_id: string) => {
    return await prisma.tutorProfile.findUniqueOrThrow({
        where: { tutor_id },
        include: {
            tutor: true,
            reviews: true,
            tutorSubjects: true,
            availabilities: true,
        },
    });
};

const updateTutorProfile = async (
    payload: Partial<TutorProfile>,
    tutorProfileId: string,
) => {
    return await prisma.tutorProfile.update({
        where: { tutor_profile_id: tutorProfileId },
        data: payload,
    });
};

export const tutorProfileService = {
    createTutorProfile,
    updateTutorProfile,
    getAllTutors,
    getTutorDetails,
};

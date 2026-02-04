import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            phone: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            tutorProfiles: {
                select: {
                    tutor_profile_id: true,
                    hourly_rate: true,
                    year_of_experience: true,
                    avg_rating: true,
                    created_at: true,
                    updated_at: true,
                },
            },
        },
    });
};

const getUserDetails = async (userId: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: { tutorProfiles: true },
    });
};

const banUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status: "BAN" },
    });
};
const unbanUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
    });
};

export const userService = {
    getAllUsers,
    getUserDetails,
    banUser,
    unbanUser,
};

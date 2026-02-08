import type {
    User,
    UserRoles,
    UserStatus,
} from "../../../generated/prisma/client";
import type { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllUsers = async ({
    search,
    status,
    role,
    page,
    limit,
    skip,
    sortOrder,
    sortBy,
    tutorProfiles,
}: {
    search: string | undefined;
    status: string | undefined;
    role: string | undefined;
    page: number;
    limit: number;
    skip: number;
    sortOrder: string;
    sortBy: string;
    tutorProfiles: string | undefined;
}) => {
    const andCondition: UserWhereInput[] = [];
    if (search) {
        andCondition.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ],
        });
    }
    if (tutorProfiles) {
        andCondition.push({
            tutorProfiles: { isNot: null },
        });
    }
    if (role) {
        andCondition.push({
            role: role as UserRoles,
        });
    }
    if (status) {
        andCondition.push({
            status: status as UserStatus,
        });
    }

    const result = await prisma.user.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition,
        },
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
                    is_featured: true,
                    tutorSubjects: { include: { subject: true } },
                    availabilities: true,
                },
            },
        },
        orderBy: { [sortBy]: sortOrder },
    });
    return {
        data: result,
        meta: {
            page,
            limit,
            total: result.length,
            totalPages: Math.ceil(result.length / limit),
        },
    };
};

const getUserDetails = async (userId: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
            tutorProfiles: {
                include: {
                    availabilities: true,
                    tutorSubjects: { include: { subject: true } },
                    reviews: true,
                    bookings: true,
                },
            },
        },
    });
};

const getUserTutorDetails = async (userId: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: { id: userId, role: "TUTOR" },
        include: {
            tutorProfiles: {
                include: {
                    tutorSubjects: { include: { subject: true } },
                    availabilities: true,
                    reviews: true,
                    bookings: true,
                },
            },
        },
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

const updateUserById = async (userId: string, payload: Partial<User>) => {
    return await prisma.user.update({
        where: { id: userId },
        data: payload,
    });
};

export const userService = {
    getAllUsers,
    getUserDetails,
    banUser,
    unbanUser,
    updateUserById,
    getUserTutorDetails,
};

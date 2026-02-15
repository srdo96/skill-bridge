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
    isFeatured,
    minRating,
    maxRating,
    minPrice,
    maxPrice,
    category,
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
    isFeatured: string | undefined;
    minRating: number | undefined;
    maxRating: number | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    category: string | undefined;
}) => {
    const andCondition: UserWhereInput[] = [];
    if (search) {
        andCondition.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },

                {
                    tutorProfiles: {
                        tutorSubjects: {
                            some: {
                                subject: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    },
                },
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
    if (isFeatured === "true") {
        andCondition.push({
            tutorProfiles: {
                is_featured: Boolean(isFeatured),
            },
        });
    }
    if (minRating !== undefined) {
        andCondition.push({
            tutorProfiles: {
                avg_rating: {
                    gte: minRating,
                },
            },
        });
    }
    if (maxRating !== undefined) {
        andCondition.push({
            tutorProfiles: {
                avg_rating: {
                    lte: maxRating,
                },
            },
        });
    }
    if (minPrice !== undefined) {
        andCondition.push({
            tutorProfiles: {
                hourly_rate: {
                    gte: minPrice,
                },
            },
        });
    }
    if (maxPrice !== undefined) {
        andCondition.push({
            tutorProfiles: {
                hourly_rate: {
                    lte: maxPrice,
                },
            },
        });
    }
    if (category) {
        andCondition.push({
            tutorProfiles: {
                tutorSubjects: {
                    some: {
                        subject: {
                            category: {
                                name: {
                                    contains: category,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    const whereClause: UserWhereInput = {
        AND: andCondition,
    };

    const [result, total] = await Promise.all([
        prisma.user.findMany({
            take: limit,
            skip,
            where: whereClause,
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
        }),
        prisma.user.count({
            where: whereClause,
        }),
    ]);
    return {
        data: result,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
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

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
        },
    });
};

export const userService = {
    getAllUsers,
};

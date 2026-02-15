import type { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category) => {
    return await prisma.category.create({ data: payload });
};

const getAllCategories = async ({
    page = 1,
    limit = 10,
    skip = 0,
}: { page?: number; limit?: number; skip?: number } = {}) => {
    const [data, total] = await Promise.all([
        prisma.category.findMany({
            skip,
            take: limit,
            orderBy: { name: "asc" },
            include: { subjects: { orderBy: { name: "asc" } } },
        }),
        prisma.category.count(),
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const categoryService = { createCategory, getAllCategories };

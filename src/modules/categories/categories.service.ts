import type { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category) => {
    return await prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { subjects: { orderBy: { name: "asc" } } },
    });
};

export const categoryService = { createCategory, getAllCategories };

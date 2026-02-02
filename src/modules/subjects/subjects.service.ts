import type { Subject } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSubject = async (payload: Subject) => {
    return await prisma.subject.create({ data: payload });
};

const getAllSubject = async () => {
    return await prisma.subject.findMany({ orderBy: { name: "asc" } });
};

export const subjectsService = { createSubject, getAllSubject };

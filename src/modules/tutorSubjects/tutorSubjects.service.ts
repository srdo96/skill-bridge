import type { TutorSubject } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutorSubjects = async (payload: TutorSubject) => {
    console.log("createTutorSubjects", payload);
    return await prisma.tutorSubject.create({ data: payload });
};

export const tutorSubjectsService = { createTutorSubjects };

import type { TutorSubject } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutorSubjects = async (payload: TutorSubject) => {
    console.log("createTutorSubjects", payload);
    return await prisma.tutorSubject.create({ data: payload });
};

const getTutorSubjects = async (tutorProfileId: string) => {
    return await prisma.tutorSubject.findMany({
        where: { tutor_profile_id: tutorProfileId },
        omit: { subject_id: true },
        include: { subject: true },
    });
};

const deleteTutorSubjectBySubjectId = async (
    tutorProfileId: string,
    subjectId: string,
) => {
    return await prisma.tutorSubject.delete({
        where: {
            tutor_profile_id_subject_id: {
                tutor_profile_id: tutorProfileId,
                subject_id: subjectId,
            },
        },
    });
};
export const tutorSubjectsService = {
    createTutorSubjects,
    getTutorSubjects,
    deleteTutorSubjectBySubjectId,
};

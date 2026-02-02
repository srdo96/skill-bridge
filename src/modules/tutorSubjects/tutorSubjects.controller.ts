import type { NextFunction, Response } from "express";
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../lib/responseHandler";
import type { AuthenticatedRequest } from "../../middlewares/auth";
import { tutorSubjectsService } from "./tutorSubjects.service";

const createTutorSubjects = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.id;
        const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
            where: { tutor_id: userId },
            select: { tutor_profile_id: true },
        });
        // if (!Array.isArray(req.body)) {
        //     req.body = [req.body];
        // }
        // const payload = req.body.map((item: TutorSubject) => {
        //     return {
        //         ...item,
        //         tutor_profile_id: tutorProfile.tutor_profile_id,
        //     };
        // });

        const payload = {
            tutor_profile_id: tutorProfile.tutor_profile_id,
            subject_id: req.body.subject_id,
        };
        const data = await tutorSubjectsService.createTutorSubjects(payload);
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Created tutor subjects successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getTutorSubjects = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.id;
        const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
            where: { tutor_id: userId },
            select: { tutor_profile_id: true },
        });

        const data = await tutorSubjectsService.getTutorSubjects(
            tutorProfile.tutor_profile_id,
        );
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get tutor subjects successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};
export const tutorSubjectsController = {
    createTutorSubjects,
    getTutorSubjects,
};

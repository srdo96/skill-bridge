import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import type { AuthenticatedRequest } from "../../middlewares/auth";
import { tutorProfileService } from "./tutorProfile.service";

const createTutorProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        console.log("HIT");
        const result = await tutorProfileService.createTutorProfile(
            req.body,
            req.user.id,
        );
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Profile Created Successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateTutorProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
    } catch (error) {
        next(error);
    }
};
export const tutorProfileController = {
    createTutorProfile,
    updateTutorProfile,
};

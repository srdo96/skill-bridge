import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import type { AuthenticatedRequest } from "../../middlewares/auth";
import { userService } from "../user/user.service";
import { tutorProfileService } from "./tutorProfile.service";

const createTutorProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
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

const getAllTutors = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === "string" ? search : undefined;

        const list = await tutorProfileService.getAllTutors({
            search: searchString,
        });
        return sendResponse(res, {
            success: true,
            statusCode: 200,
            data: list,
            message: "Fetch Successfully",
        });
    } catch (error) {
        next(error);
    }
};

const getTutorDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { tutorId } = req.params;
        if (!tutorId) throw new Error("Tutor Id Required!");
        if (Array.isArray(tutorId)) throw new Error("Id Formant not valid");

        const data = await tutorProfileService.getTutorDetails(tutorId);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data,
            message: "Tutor details fetched successfully",
        });
    } catch (error) {
        next(error);
    }
};

const getMyProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await userService.getUserDetails(req.user.id);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data,
            message: "My profile fetched successfully",
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
        const { tutorProfileId } = req.params;
        console.log("tutorProfileId", tutorProfileId);
        if (!tutorProfileId) throw new Error("Tutor Profile Id Required!");
        if (Array.isArray(tutorProfileId))
            throw new Error("Profile Id Formant not valid");
        console.log("req.body", req.body);
        const data = await tutorProfileService.updateTutorProfile(
            req.body,
            tutorProfileId,
        );
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data,
            message: "Tutor profile updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const tutorProfileController = {
    createTutorProfile,
    updateTutorProfile,
    getAllTutors,
    getTutorDetails,
    getMyProfile,
};

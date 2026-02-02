import type { NextFunction, Response } from "express";
import type { Availability } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../lib/responseHandler";
import type { AuthenticatedRequest } from "../../middlewares/auth";
import { availabilityService } from "./availability.service";

const createAvailability = async (
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

        if (!Array.isArray(req.body)) {
            req.body = [req.body];
        }
        const payloads = req.body.map((item: Availability) => {
            return {
                ...item,
                tutor_profile_id: tutorProfile.tutor_profile_id,
            };
        });
        const data = await availabilityService.createAvailability(payloads);

        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Created availability successfully",
            data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const availabilityController = { createAvailability };

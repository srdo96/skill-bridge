import type { NextFunction, Request, Response } from "express";
import { UserRoles } from "../../../generated/prisma/client";
import { sendResponse } from "../../lib/responseHandler";
import type { AuthenticatedRequest } from "../../middlewares/auth";
import { dashboardService } from "./dashboard.service";

const getStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { role, id } = req.user;
        let data;

        switch (role) {
            case UserRoles.ADMIN:
                data = await dashboardService.getAdminStats();
                break;
            case UserRoles.TUTOR:
                data = await dashboardService.getTutorStats(id);
                break;
            case UserRoles.STUDENT:
                data = await dashboardService.getStudentStats(id);
                break;
            default:
                return sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Invalid role",
                    data: null,
                });
        }

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Dashboard statistics fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getLandingPageStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await dashboardService.getLandingPageStats();
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Landing page statistics fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};
export const dashboardController = {
    getStats,
    getLandingPageStats,
};

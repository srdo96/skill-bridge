import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await userService.getAllUsers();
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all users successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "User ID is required",
            });
        }
        if (Array.isArray(userId)) throw new Error("Id Formant not valid");
        const data = await userService.getUserDetails(userId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get user details successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const banUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "User ID is required",
            });
        }
        if (Array.isArray(userId)) throw new Error("Id Formant not valid");
        const data = await userService.banUser(userId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `User ${data.name} banned successfully`,
            data,
        });
    } catch (error) {
        next(error);
    }
};
const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "User ID is required",
            });
        }
        if (Array.isArray(userId)) throw new Error("Id Formant not valid");
        const data = await userService.unbanUser(userId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `User ${data.name} unbanned successfully`,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    getAllUsers,
    getUserDetails,
    banUser,
    unbanUser,
};

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

export const userController = { getAllUsers };

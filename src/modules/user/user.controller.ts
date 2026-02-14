import type { NextFunction, Request, Response } from "express";
import type { UserRoles, UserStatus } from "../../../generated/prisma/enums";
import { sendResponse } from "../../lib/responseHandler";
import paginationSortingHelper from "../../utils/paginationSortingHelper";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse filters
        const { search } = req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const status = req.query.status as UserStatus | undefined;
        const role = req.query.role as UserRoles | undefined;
        const tutorProfiles = req.query.tutorProfiles as string | undefined;
        const category = req.query.category as string | undefined;
        const isFeatured = req.query.isFeatured as string | undefined;
        const minRatingRaw = req.query.minRating;
        const maxRatingRaw = req.query.maxRating;
        const minPriceRaw = req.query.minPrice;
        const maxPriceRaw = req.query.maxPrice;
        const minRating =
            typeof minRatingRaw === "string" &&
            !Number.isNaN(Number(minRatingRaw))
                ? Number(minRatingRaw)
                : undefined;
        const maxRating =
            typeof maxRatingRaw === "string" &&
            !Number.isNaN(Number(maxRatingRaw))
                ? Number(maxRatingRaw)
                : undefined;
        const minPrice =
            typeof minPriceRaw === "string" &&
            !Number.isNaN(Number(minPriceRaw))
                ? Number(minPriceRaw)
                : undefined;
        const maxPrice =
            typeof maxPriceRaw === "string" &&
            !Number.isNaN(Number(maxPriceRaw))
                ? Number(maxPriceRaw)
                : undefined;

        const { page, limit, skip, sortBy, sortOrder } =
            paginationSortingHelper(req.query);
        const data = await userService.getAllUsers({
            search: searchString,
            status,
            role,
            page,
            limit,
            skip,
            sortOrder,
            sortBy,
            tutorProfiles,
            isFeatured,
            minRating,
            maxRating,
            minPrice,
            maxPrice,
            category,
        });

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all users successfully",
            data: data.data,
            meta: data.meta,
        });
    } catch (error) {
        console.log(error);
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
        console.log("data", data);
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

const getUserTutorDetails = async (
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
        console.log("userIdssss", userId);
        const data = await userService.getUserTutorDetails(userId);
        console.log("dataaaaa", data);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get user tutor details successfully",
            data,
        });
    } catch (error) {
        console.log("error", error);
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

const updateUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        if (!userId) throw new Error("User ID Required!");
        if (Array.isArray(userId)) throw new Error("Id Formant not valid");

        const data = await userService.updateUserById(userId, req.body);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `User ${data.name} updated successfully`,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    getAllUsers,
    getUserDetails,
    getUserTutorDetails,
    banUser,
    unbanUser,
    updateUserById,
};

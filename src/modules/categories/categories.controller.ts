import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import { categoryService } from "./categories.service";

const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await categoryService.createCategory(req.body);
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Category created successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await categoryService.getAllCategories();
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all categories successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const categoryController = { createCategory, getAllCategories };

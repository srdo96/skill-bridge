import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import paginationSortingHelper from "../../utils/paginationSortingHelper";
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
        const { page, limit, skip } = paginationSortingHelper(req.query);
        const data = await categoryService.getAllCategories({
            page,
            limit,
            skip,
        });
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all categories successfully",
            data: data.data,
            meta: data.meta,
        });
    } catch (error) {
        next(error);
    }
};

export const categoryController = { createCategory, getAllCategories };

import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/responseHandler";
import { subjectsService } from "./subjects.service";

const createSubject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await subjectsService.createSubject(req.body);
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Created subject successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getAllSubject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await subjectsService.getAllSubject();
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all subjects successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const subjectsController = { createSubject, getAllSubject };

import type { Response } from "express";

export interface IApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;
    meta?: { [key: string]: any };
}

export const sendResponse = <T>(
    res: Response,
    { success, statusCode, message, data, meta }: IApiResponse<T>,
) => {
    return res.status(statusCode).json({ success, message, data, meta });
};

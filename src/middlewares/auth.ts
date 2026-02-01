import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import type { UserRoles } from "../../generated/prisma/enums";
import { auth as betterAuth } from "../lib/auth";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: UserRoles;
                emailVerified: boolean;
            };
        }
    }
}

export type AuthenticatedRequest = Request & {
    user: NonNullable<Request["user"]>;
};
export interface IAuthenticatedRequest extends Request {
    user: NonNullable<Request["user"]>;
}

const auth = (...roles: UserRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!",
                });
            }
            // if (!session.user.emailVerified) {
            //     return res.status(403).json({
            //         success: false,
            //         message: "Your email is not verified yet!",
            //     });
            // }
            console.log("Hello From AUTH");
            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                emailVerified: session.user.emailVerified,
                role: session.user.role as UserRoles,
            };
            if (roles.length && !roles.includes(req.user.role as UserRoles)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! Unauthorize User.",
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;

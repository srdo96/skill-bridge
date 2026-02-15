import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { UserStatus } from "../../generated/prisma/enums";
import { env } from "../env";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    baseURL: env.betterAuthUrl,
    trustedOrigins: [env.corsOrigin],
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const user = await prisma.user.findUnique({
                        where: { id: session.userId },
                        select: { status: true },
                    });

                    if (!user) return false;

                    if (user.status === UserStatus.BAN) {
                        throw new APIError("FORBIDDEN", {
                            message:
                                "Your account has been banned. Please contact support.",
                        });
                    }
                },
            },
        },
    },
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    user: {
        additionalFields: {
            role: { type: "string", defaultValue: "STUDENT" },
            phone: { type: "string", required: false },
            img_url: { type: "string", required: false },
            status: { type: "string", required: false, defaultValue: "ACTIVE" },
        },
    },
});

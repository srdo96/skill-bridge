import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "../env";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    baseURL: env.betterAuthUrl,
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
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

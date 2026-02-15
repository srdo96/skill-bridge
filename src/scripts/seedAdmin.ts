import { UserRoles } from "../../generated/prisma/enums";
import { env } from "../env";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: env.adminEmail },
        });
        if (existingUser) {
            console.log("Admin already exists");
            return;
        }
        const signUpData = {
            name: env.adminName,
            email: env.adminEmail,
            password: env.adminPassword,
        };

        const signedUpAdmin = await fetch(
            `${env.betterAuthUrl}/api/auth/sign-up/email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: env.betterAuthUrl,
                },
                body: JSON.stringify(signUpData),
            },
        );
        if (!signedUpAdmin.ok) {
            const errorText = await signedUpAdmin.text();
            throw new Error(
                `Failed to create admin: ${signedUpAdmin.status} ${signedUpAdmin.statusText} - ${errorText}`,
            );
        }
        const result = await signedUpAdmin.json();
        console.log("Admin created successfully", result);

        const updatedUser = await prisma.user.update({
            where: { email: env.adminEmail },
            data: {
                role: UserRoles.ADMIN,
                emailVerified: true,
            },
        });
        console.log("Admin updated successfully", updatedUser);
    } catch (error: any) {
        if (error.code === "ECONNREFUSED") {
            console.error(
                `Connection refused! Make sure the server is running on `,
            );
            console.error("Start the server first with: pnpm dev\n");
        } else {
            console.error("Error seeding admin:", error.message || error);
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();

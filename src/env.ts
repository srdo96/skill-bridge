import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid env.....");
    console.log(z.prettifyError(parsedEnv.error));
    process.exit(1);
}

export const env = {
    port: parsedEnv.data.PORT,
    dbUrl: parsedEnv.data.DATABASE_URL,
};

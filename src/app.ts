import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Application, type Response } from "express";
import { auth } from "./lib/auth";
import errorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import v1Routes from "./routes/v1";
const app: Application = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);
app.use(express.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api/v1", v1Routes);

app.get("/", (_req, res: Response) => {
    res.send("Welcome to the Skill Bridge App");
});

app.use(notFound);
app.use(errorHandler);

export default app;

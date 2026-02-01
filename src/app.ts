import { toNodeHandler } from "better-auth/node";
import express, { type Application, type Response } from "express";
import { auth } from "./lib/auth";
const app: Application = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.get("/", (_req, res: Response) => {
    res.send("Welcome to the Skill Bridge App");
});

export default app;

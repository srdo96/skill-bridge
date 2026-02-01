import express, { type Application, type Response } from "express";

const app: Application = express();

app.use(express.json());

app.get("/", (_req, res: Response) => {
    res.send("Welcome to the Skill Bridge App");
});

export default app;

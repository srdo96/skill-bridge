import type { Router } from "express";
import express from "express";
import { subjectsController } from "./subjects.controller";

const router: Router = express.Router();

router.post("/", subjectsController.createSubject);
router.get("/", subjectsController.getAllSubject);

export default router;

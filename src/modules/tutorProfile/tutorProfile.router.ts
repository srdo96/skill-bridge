import express, { Router } from "express";
import { tutorProfileController } from "./tutorProfile.controller";

const router: Router = express.Router();

router.post("/", tutorProfileController.createTutorProfile);

export default router;

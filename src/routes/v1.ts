import { Router, type Router as ExpressRouter } from "express";
import tutorProfileRoutes from "../modules/tutorProfile/tutorProfile.router";

const router: ExpressRouter = Router();

router.use("/tutors", tutorProfileRoutes);

export default router;

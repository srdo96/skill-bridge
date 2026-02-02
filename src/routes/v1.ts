import { Router, type Router as ExpressRouter } from "express";
import categoriesRouters from "../modules/categories/categories.router";
import subjectsRouters from "../modules/subjects/subjects.router";
import tutorProfileRoutes from "../modules/tutorProfile/tutorProfile.router";

const router: ExpressRouter = Router();

router.use("/tutors", tutorProfileRoutes);
router.use("/categories", categoriesRouters);
router.use("/subjects", subjectsRouters);

export default router;

import express, { type RequestHandler, type Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { dashboardController } from "./dashboard.controller";

const router: Router = express.Router();

router.get(
    "/stats",
    auth(UserRoles.ADMIN, UserRoles.TUTOR, UserRoles.STUDENT),
    dashboardController.getStats as RequestHandler,
);

router.get("/landing-page-stats", dashboardController.getLandingPageStats);

export default router;

import express, { Router, type RequestHandler } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { tutorProfileController } from "./tutorProfile.controller";

const router: Router = express.Router();

router.post(
    "/profile",
    auth("TUTOR"),
    tutorProfileController.createTutorProfile as RequestHandler,
);

router.put(
    "/profile",
    auth(UserRoles.ADMIN, UserRoles.TUTOR),
    tutorProfileController.updateTutorProfile,
);

export default router;

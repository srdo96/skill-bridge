import express, { Router, type RequestHandler } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { tutorProfileController } from "./tutorProfile.controller";

const router: Router = express.Router();

router.post(
    "/profile",
    auth(UserRoles.TUTOR),
    tutorProfileController.createTutorProfile as RequestHandler,
);

router.get(
    "/my-profile",
    auth(UserRoles.TUTOR),
    tutorProfileController.getMyProfile as RequestHandler,
);
router.get("/", tutorProfileController.getAllTutors as RequestHandler);

router.get("/:tutorId", tutorProfileController.getTutorDetails);

router.patch(
    "/profile/:tutorProfileId",
    auth(UserRoles.ADMIN, UserRoles.TUTOR),
    tutorProfileController.updateTutorProfile,
);

router.put(
    "/profile",
    auth(UserRoles.ADMIN, UserRoles.TUTOR),
    tutorProfileController.updateTutorProfile,
);

export default router;

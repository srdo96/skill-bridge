import express, { type RequestHandler, type Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { availabilityController } from "./availability.controller";

const router: Router = express.Router();
router.post(
    "/",
    auth(UserRoles.TUTOR),
    availabilityController.createAvailability as RequestHandler,
);

router.delete(
    "/:availabilityId",
    auth(UserRoles.TUTOR),
    availabilityController.deleteAvailabilityById,
);

export default router;

import express, { type RequestHandler, type Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { bookingController } from "./booking.controller";

const router: Router = express.Router();
router.post(
    "/",
    auth(UserRoles.STUDENT),
    bookingController.createBooking as RequestHandler,
);

router.get(
    "/",
    auth(UserRoles.STUDENT, UserRoles.ADMIN, UserRoles.TUTOR),
    bookingController.getAllBookings as RequestHandler,
);

router.patch(
    "/:bookingId/cancel",
    auth(UserRoles.STUDENT),
    bookingController.cancelBooking,
);

router.get(
    "/:bookingId",
    auth(UserRoles.STUDENT, UserRoles.TUTOR),
    bookingController.getBookingDetails,
);

export default router;

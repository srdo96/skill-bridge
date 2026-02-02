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
    auth(UserRoles.STUDENT),
    bookingController.getBookings as RequestHandler,
);
export default router;

import express, { type Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router: Router = express.Router();

router.post("/", auth(UserRoles.STUDENT), reviewController.createReview);
router.get("/", auth(UserRoles.STUDENT), reviewController.getAllReviews);
router.get(
    "/:reviewId",
    auth(UserRoles.STUDENT),
    reviewController.getReviewsDetails,
);
export default router;

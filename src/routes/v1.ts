import { Router, type Router as ExpressRouter } from "express";
import categoriesRouters from "../modules/categories/categories.router";
import subjectsRouters from "../modules/subjects/subjects.router";
import tutorProfileRoutes from "../modules/tutorProfile/tutorProfile.router";
import availabilityRoutes from "../modules/availability/availability.router";
import tutorSubjectsRoutes from "../modules/tutorSubjects/tutorSubjects.router";
import bookingRoutes from "../modules/booking/booking.router";
import reviewRoutes from "../modules/review/review.router";
import userRoutes from "../modules/user/user.router";

const router: ExpressRouter = Router();

router.use("/users", userRoutes);
router.use("/tutors", tutorProfileRoutes);
router.use("/categories", categoriesRouters);
router.use("/subjects", subjectsRouters);
router.use("/availability", availabilityRoutes);
router.use("/tutor-subjects", tutorSubjectsRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
export default router;

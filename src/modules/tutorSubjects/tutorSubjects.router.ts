import express, { type RequestHandler, type Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { tutorSubjectsController } from "./tutorSubjects.controller";

const router: Router = express.Router();

router.post(
    "/",
    auth(UserRoles.TUTOR),
    tutorSubjectsController.createTutorSubjects as RequestHandler,
);

router.get(
    "/",
    auth(UserRoles.TUTOR),
    tutorSubjectsController.getTutorSubjects as RequestHandler,
);

router.delete(
    "/:subjectId",
    auth(UserRoles.TUTOR),
    tutorSubjectsController.deleteTutorSubjectBySubjectId as RequestHandler,
);

export default router;

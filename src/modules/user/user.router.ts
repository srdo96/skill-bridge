import express, { Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

const router: Router = express.Router();

router.get("/", auth(UserRoles.ADMIN), userController.getAllUsers);

export default router;

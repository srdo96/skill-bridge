import express, { Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

const router: Router = express.Router();

router.get("/", auth(UserRoles.ADMIN), userController.getAllUsers);
router.get("/:userId", auth(UserRoles.ADMIN), userController.getUserDetails);
router.patch("/:userId/ban", auth(UserRoles.ADMIN), userController.banUser);
router.patch("/:userId/unban", auth(UserRoles.ADMIN), userController.unbanUser);
export default router;

import express, { Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { categoryController } from "./categories.controller";

const router: Router = express.Router();

router.post("/", auth(UserRoles.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);

export default router;

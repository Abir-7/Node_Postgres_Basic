import { Router } from "express";
import { UserController } from "../controller/user.controller";

const router = Router();

router.post("/", UserController.createUser);

export const UserRoute = router;

import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

const router = Router();

router.post("/create-user", AuthController.createUser);
router.patch("/verify-user", AuthController.verifyUser);

export const AuthRoute = router;

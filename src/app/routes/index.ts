import { Router } from "express";
import { UserRoute } from "./user.routes";

const router = Router();

const apiRoutes = [{ path: "/user", route: UserRoute }];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

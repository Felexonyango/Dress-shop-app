import { Router } from "express";
import { protect, authorize } from "../middleware/auth"
import { index } from "../controller/dashboardcontroller"

const router = Router();

router.route("/").get(protect, authorize("admin"), index);

export { router as dashboardRoutes };

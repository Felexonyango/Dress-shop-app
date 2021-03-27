import { Router } from 'express';
import { index } from "../controller/orderController"
import { protect } from  "../middleware/auth"

const router = Router();

router.route('/').get(protect, index);

export { router as orderRoutes };

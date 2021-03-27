import { Router } from 'express';
import { index, store, remove, update } from '../controller/cartController'
import { protect } from '../middleware/auth'

const router = Router();

router.route('/').get(protect, index).post(protect, store);

router.route('/:id').delete(protect, remove);
router.route('/:id').patch(protect, update);

export { router as cartRoutes };

import { Router } from 'express';
import { index } from '../controller/categoryController'

const router = Router();

router.route('/').get(index);

export { router as categoryRoutes };

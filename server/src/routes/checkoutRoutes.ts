import { Router } from 'express';
import {createPaypalTransaction,capturePaypalTransaction,
} from "../controller/checkoutController"
import { protect } from '../middleware/auth'

const router = Router();

router
  .route('/create-paypal-transaction')
  .post(protect, createPaypalTransaction);

router
  .route('/capture-paypal-transaction')
  .post(protect, capturePaypalTransaction);

export { router as checkOutRoutes };

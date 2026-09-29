import { Router } from 'express';
import { applyCoupon, removeCoupon } from '../controllers/couponController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/apply', applyCoupon);
router.post('/remove', removeCoupon);

export default router;

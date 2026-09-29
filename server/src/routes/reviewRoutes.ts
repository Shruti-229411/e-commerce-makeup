import { Router } from 'express';
import { createReview, getProductReviews, getMyReviews, updateReview, deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.get('/my-reviews', protect, getMyReviews);

router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;

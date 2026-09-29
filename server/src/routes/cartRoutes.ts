import { Router } from 'express';
import { getCart, addToCart, updateCartItemQuantity, removeCartItem } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items', updateCartItemQuantity);
router.delete('/items/:productId', removeCartItem);

export default router;

import { Router } from 'express';
import { createReturnRequest, getMyReturnRequests, getReturnById } from '../controllers/returnController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', createReturnRequest);
router.get('/my-returns', getMyReturnRequests);
router.get('/:id', getReturnById);

export default router;

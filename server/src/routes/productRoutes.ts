import { Router } from 'express';
import {
  getProducts,
  searchProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBestsellers,
  getNewArrivals
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/slug/:slug', getProductBySlug);

export default router;

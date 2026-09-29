import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware';
import {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  createBrand,
  updateBrand,
  deleteBrand,
  getAdminOrders,
  updateOrderStatus,
  getAdminInventory,
  updateInventoryStock,
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAdminCustomers,
  toggleCustomerStatus,
  getAdminReturns,
  updateReturnStatus,
  getAdminReviews,
  updateReviewStatus,
  deleteReviewAdmin
} from '../controllers/adminController';

const router = Router();

// Apply protect + adminOnly to ALL admin endpoints
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products Admin CRUD
router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories Admin CRUD
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Brands Admin CRUD
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

// Orders Admin Fulfillment
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Inventory Admin Management
router.get('/inventory', getAdminInventory);
router.put('/inventory/:id', updateInventoryStock);

// Coupons Admin Management
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Customer Accounts Admin Management
router.get('/customers', getAdminCustomers);
router.put('/customers/:id/status', toggleCustomerStatus);

// Returns Admin Moderation
router.get('/returns', getAdminReturns);
router.put('/returns/:id/status', updateReturnStatus);

// Reviews Admin Moderation
router.get('/reviews', getAdminReviews);
router.put('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReviewAdmin);

export default router;

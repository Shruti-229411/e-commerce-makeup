import request from 'supertest';
import app from '../app';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Inventory from '../models/Inventory';
import Order from '../models/Order';
import ReturnRequest from '../models/ReturnRequest';
import Review from '../models/Review';
import Coupon from '../models/Coupon';
import { connectDB, disconnectDB } from '../config/db';

jest.setTimeout(60000);

describe('Phase 7 — Admin Management & Authorization API Tests', () => {
  let adminToken: string;
  let customerToken: string;
  let customerId: string;
  let createdProductId: string;
  let createdCategoryId: string;
  let createdBrandId: string;
  let createdOrderId: string;
  let createdReturnId: string;
  let createdReviewId: string;
  let createdInventoryId: string;

  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Inventory.deleteMany({});
    await Order.deleteMany({});
    await ReturnRequest.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});

    // 1. Create Admin User
    const adminRes = await request(app).post('/api/auth/register').send({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin.test@glowcart.com',
      password: 'AdminPassword123!',
      phone: '+91 9999988888'
    });
    // Promote user to admin
    await User.findOneAndUpdate({ email: 'admin.test@glowcart.com' }, { role: 'admin' });

    // Login Admin to get token
    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: 'admin.test@glowcart.com',
      password: 'AdminPassword123!'
    });
    adminToken = adminLoginRes.body.token;

    // 2. Create Customer User
    const customerRes = await request(app).post('/api/auth/register').send({
      firstName: 'Customer',
      lastName: 'User',
      email: 'customer.test@glowcart.com',
      password: 'CustomerPassword123!',
      phone: '+91 8888877777'
    });
    customerToken = customerRes.body.token;
    customerId = customerRes.body.user._id;

    // 3. Create Seed Category & Brand
    const cat = await Category.create({ name: 'Skincare', slug: 'skincare' });
    createdCategoryId = cat._id.toString();

    const brand = await Brand.create({ name: 'Loreal', slug: 'loreal', logo: '/img.png' });
    createdBrandId = brand._id.toString();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // ==========================================
  // AUTHENTICATION & ROLE AUTHORIZATION TESTS
  // ==========================================
  it('1. Should deny unauthenticated access to admin dashboard (401)', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('2. Should deny customer role access to admin dashboard (403)', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('3. Should allow admin role access to admin dashboard (200)', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toHaveProperty('totalRevenue');
    expect(res.body.stats).toHaveProperty('totalOrders');
  });

  // ==========================================
  // PRODUCT ADMIN MANAGEMENT & SECURITY
  // ==========================================
  it('4. Should DENY customer from creating a product (403)', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Unauth Product',
        price: 500,
        mrp: 600,
        brand: createdBrandId,
        category: createdCategoryId,
        sku: 'UNAUTH-01'
      });
    expect(res.status).toBe(403);
  });

  it('5. Should ALLOW admin to create a product (201)', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Glow Serum',
        slug: 'glow-serum',
        price: 999,
        mrp: 1299,
        brand: createdBrandId,
        category: createdCategoryId,
        sku: 'GLOW-SERUM-01',
        stock: 50
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    createdProductId = res.body.product._id;
  });

  it('6. Should REJECT duplicate SKU creation (400)', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Duplicate SKU Serum',
        price: 999,
        mrp: 1299,
        brand: createdBrandId,
        category: createdCategoryId,
        sku: 'GLOW-SERUM-01'
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already exists');
  });

  it('7. Should REJECT duplicate slug creation (400)', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Duplicate Slug Serum',
        slug: 'glow-serum',
        price: 999,
        mrp: 1299,
        brand: createdBrandId,
        category: createdCategoryId,
        sku: 'UNIQUE-SKU-999'
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already exists');
  });

  it('8. Should DENY customer from modifying a product (403)', async () => {
    const res = await request(app)
      .put(`/api/admin/products/${createdProductId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ price: 100 });
    expect(res.status).toBe(403);
  });

  it('9. Should ALLOW admin to update product details and price (200)', async () => {
    const res = await request(app)
      .put(`/api/admin/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 1099, stock: 75 });
    expect(res.status).toBe(200);
    expect(res.body.product.price).toBe(1099);
    expect(res.body.product.stock).toBe(75);
  });

  it('10. Should DENY customer from deactivating a product (403)', async () => {
    const res = await request(app)
      .delete(`/api/admin/products/${createdProductId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  it('11. Should ALLOW admin to soft-delete product (200)', async () => {
    const res = await request(app)
      .delete(`/api/admin/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const checkProduct = await Product.findById(createdProductId);
    expect(checkProduct?.isActive).toBe(false);

    // Re-activate for further tests
    await Product.findByIdAndUpdate(createdProductId, { isActive: true });
  });

  // ==========================================
  // CATEGORIES & BRANDS MUTATION TESTS
  // ==========================================
  it('12. Should DENY customer from creating a category (403)', async () => {
    const res = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Haircare' });
    expect(res.status).toBe(403);
  });

  it('13. Should ALLOW admin to create a category (201)', async () => {
    const res = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Haircare', slug: 'haircare' });
    expect(res.status).toBe(201);
  });

  it('14. Should DENY customer from creating a brand (403)', async () => {
    const res = await request(app)
      .post('/api/admin/brands')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Maybelline' });
    expect(res.status).toBe(403);
  });

  it('15. Should ALLOW admin to create a brand (201)', async () => {
    const res = await request(app)
      .post('/api/admin/brands')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Maybelline', slug: 'maybelline', logo: '/logo.png' });
    expect(res.status).toBe(201);
  });

  // ==========================================
  // INVENTORY STOCK ADJUSTMENT & INTEGRITY
  // ==========================================
  it('16. Should DENY customer from adjusting inventory (403)', async () => {
    const inv = await Inventory.findOne({ product: createdProductId });
    createdInventoryId = inv!._id.toString();

    const res = await request(app)
      .put(`/api/admin/inventory/${createdInventoryId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ availableStock: 100 });
    expect(res.status).toBe(403);
  });

  it('17. Should REJECT negative stock adjustment (400)', async () => {
    const res = await request(app)
      .put(`/api/admin/inventory/${createdInventoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ availableStock: -20 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('cannot be negative');
  });

  it('18. Should ALLOW admin to update inventory stock (200)', async () => {
    const res = await request(app)
      .put(`/api/admin/inventory/${createdInventoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ availableStock: 120 });
    expect(res.status).toBe(200);
    expect(res.body.inventory.availableStock).toBe(120);

    const checkProduct = await Product.findById(createdProductId);
    expect(checkProduct?.stock).toBe(120);
  });

  // ==========================================
  // ORDERS FULFILLMENT & LIFECYCLE
  // ==========================================
  it('19. Should create test order and DENY customer from modifying order status (403)', async () => {
    const order = await Order.create({
      orderNumber: 'GLOW-TEST-99',
      user: customerId,
      items: [{ product: createdProductId, name: 'Glow Serum', price: 1099, quantity: 2, image: '/img.png' }],
      itemsPrice: 2198,
      discountAmount: 0,
      deliveryFee: 0,
      totalAmount: 2198,
      shippingAddress: { name: 'Customer', phone: '9999999999', addressLine: 'Main St', city: 'Mumbai', state: 'MH', postalCode: '400001', country: 'India', addressType: 'Home', isDefault: true },
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      statusHistory: [{ status: 'Pending', timestamp: new Date() }]
    });
    createdOrderId = order._id.toString();

    const res = await request(app)
      .put(`/api/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ orderStatus: 'Shipped' });
    expect(res.status).toBe(403);
  });

  it('20. Should ALLOW admin to update order status and append to statusHistory (200)', async () => {
    const res = await request(app)
      .put(`/api/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ orderStatus: 'Confirmed', trackingNumber: 'AWB-123456789' });

    expect(res.status).toBe(200);
    expect(res.body.order.orderStatus).toBe('Confirmed');
    expect(res.body.order.trackingNumber).toBe('AWB-123456789');
    expect(res.body.order.statusHistory.length).toBeGreaterThan(1);
    expect(res.body.order.statusHistory[1].status).toBe('Confirmed');
  });

  // ==========================================
  // RETURN WORKFLOW & SAFE INVENTORY RESTORATION
  // ==========================================
  it('21. Should create return request and DENY customer from moderating return status (403)', async () => {
    const ret = await ReturnRequest.create({
      returnNumber: 'RET-TEST-001',
      order: createdOrderId,
      user: customerId,
      items: [{ product: createdProductId, quantity: 2, reason: 'Wrong item' }],
      reason: 'Wrong item',
      status: 'Requested'
    });
    createdReturnId = ret._id.toString();

    const res = await request(app)
      .put(`/api/admin/returns/${createdReturnId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'Approved' });
    expect(res.status).toBe(403);
  });

  it('22. Should ALLOW admin to approve return request and restore inventory safely without double restoration (200)', async () => {
    const stockBefore = (await Product.findById(createdProductId))!.stock;

    // Admin approves return to 'Returned' status
    const res = await request(app)
      .put(`/api/admin/returns/${createdReturnId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Returned', adminNotes: 'Item inspected and restocked', refundAmount: 2198 });

    expect(res.status).toBe(200);
    expect(res.body.returnRequest.status).toBe('Returned');

    const stockAfter = (await Product.findById(createdProductId))!.stock;
    expect(stockAfter).toBe(stockBefore + 2);

    // Call update to 'Refunded' and verify stock is NOT restored a second time
    await request(app)
      .put(`/api/admin/returns/${createdReturnId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Refunded' });

    const stockFinal = (await Product.findById(createdProductId))!.stock;
    expect(stockFinal).toBe(stockAfter); // No double restoration!
  });

  // ==========================================
  // REVIEW MODERATION TESTS
  // ==========================================
  it('23. Should DENY customer from moderating review status (403)', async () => {
    const rev = await Review.create({
      product: createdProductId,
      user: customerId,
      rating: 5,
      title: 'Awesome Product',
      comment: 'Loved the texture',
      isVerifiedPurchase: true,
      status: 'Pending'
    });
    createdReviewId = rev._id.toString();

    const res = await request(app)
      .put(`/api/admin/reviews/${createdReviewId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'Approved' });
    expect(res.status).toBe(403);
  });

  it('24. Should ALLOW admin to approve review status (200)', async () => {
    const res = await request(app)
      .put(`/api/admin/reviews/${createdReviewId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Approved' });

    expect(res.status).toBe(200);
    expect(res.body.review.status).toBe('Approved');
    expect(res.body.review.isVerifiedPurchase).toBe(true);
  });

  // ==========================================
  // CUSTOMER MANAGEMENT & DEACTIVATION
  // ==========================================
  it('25. Should DENY customer from fetching customer list API (403)', async () => {
    const res = await request(app)
      .get('/api/admin/customers')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  it('26. Should ALLOW admin to view customer list (200)', async () => {
    const res = await request(app)
      .get('/api/admin/customers')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.customers.length).toBeGreaterThan(0);
    expect(res.body.customers[0]).not.toHaveProperty('passwordHash');
  });

  it('27. Should ALLOW admin to deactivate customer and DENY deactivated user from using API (401)', async () => {
    const toggleRes = await request(app)
      .put(`/api/admin/customers/${customerId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.user.isActive).toBe(false);

    // Deactivated user tries to access protected endpoint using old token
    const testRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(testRes.status).toBe(401);
    expect(testRes.body.message).toContain('deactivated');
  });
});

import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Address from '../models/Address';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Coupon from '../models/Coupon';

describe('Phase 5 — Shopping Flow & Checkout API Tests', () => {
  let customerToken: string;
  let testProductId: string;
  let addressId: string;

  beforeAll(async () => {
    await connectDB();

    // Register temporary test user
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Shop',
      lastName: 'User',
      email: 'shopuser@example.com',
      password: 'Password123!'
    });
    customerToken = res.body.token;

    // Create test category, brand, and product
    const category = await Category.create({ name: 'Test Skincare', slug: 'test-skincare', displayOrder: 1 });
    const brand = await Brand.create({ name: 'Test Brand', slug: 'test-brand', logo: 'https://example.com/logo.png' });

    const product = await Product.create({
      name: 'Test Glow Serum',
      slug: 'test-glow-serum',
      description: 'Nourishing test face serum.',
      shortDescription: 'Face serum for testing.',
      brand: brand._id,
      category: category._id,
      images: ['https://example.com/serum.jpg'],
      price: 1200,
      mrp: 1500,
      discount: 20,
      sku: 'SKU-TEST-SERUM',
      stock: 50,
      rating: 4.9,
      reviewCount: 10,
      ingredients: 'Test Ingredients',
      usageInstructions: 'Apply daily',
      isActive: true
    });
    testProductId = product._id.toString();

    // Create test coupon
    await Coupon.create({
      code: 'BEAUTY20',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrderValue: 500,
      maximumDiscount: 500,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: true
    });

    // Create address
    const addrRes = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Shop User',
        phone: '+91 9800000000',
        addressLine: '123 Beauty Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        isDefault: true
      });
    addressId = addrRes.body.address._id;
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'shopuser@example.com' });
    await Address.deleteMany({ name: 'Shop User' });
    await Product.deleteMany({ slug: 'test-glow-serum' });
    await Category.deleteMany({ slug: 'test-skincare' });
    await Brand.deleteMany({ slug: 'test-brand' });
    await Coupon.deleteMany({ code: 'BEAUTY20' });
    await Cart.deleteMany({});
    await Order.deleteMany({ orderNumber: /^GLOW-ORD-/ });
    await disconnectDB();
  });

  it('1. Should add item to user cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: testProductId,
        quantity: 2
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.cart.items.length).toBeGreaterThan(0);
  });

  it('2. Should fetch user cart with populated product details', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.subtotal).toBeGreaterThan(0);
  });

  it('3. Should apply coupon BEAUTY20 to cart', async () => {
    const res = await request(app)
      .post('/api/coupons/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ code: 'BEAUTY20' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.discountAmount).toBeGreaterThan(0);
  });

  it('4. Should create order securely on backend', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        shippingAddressId: addressId,
        paymentMethod: 'COD'
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.order.orderNumber).toBeDefined();
    expect(res.body.order.orderStatus).toBe('Confirmed');
    expect(res.body.order.totalAmount).toBeGreaterThan(0);
  });

  it('5. Should fetch user order history', async () => {
    const res = await request(app)
      .get('/api/orders/my-orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.orders.length).toBeGreaterThan(0);
  });
});

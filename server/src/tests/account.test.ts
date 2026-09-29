import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Review from '../models/Review';

describe('Phase 6 — User Account Management & Self-Service API Tests', () => {
  let userAToken: string;
  let userBToken: string;
  let userAOrderId: string;
  let testProductId: string;

  beforeAll(async () => {
    await connectDB();

    // Register User A
    const resA = await request(app).post('/api/auth/register').send({
      firstName: 'UserA',
      lastName: 'Customer',
      email: 'usera@example.com',
      password: 'Password123!'
    });
    userAToken = resA.body.token;

    // Register User B
    const resB = await request(app).post('/api/auth/register').send({
      firstName: 'UserB',
      lastName: 'Customer',
      email: 'userb@example.com',
      password: 'Password123!'
    });
    userBToken = resB.body.token;

    // Seed test category, brand, product & order for User A
    const category = await Category.create({ name: 'Account Test Cat', slug: 'account-test-cat', displayOrder: 1 });
    const brand = await Brand.create({ name: 'Account Test Brand', slug: 'account-test-brand', logo: 'https://example.com/logo.png' });

    const product = await Product.create({
      name: 'Account Test Cream',
      slug: 'account-test-cream',
      description: 'Face cream for testing account features.',
      shortDescription: 'Testing cream.',
      brand: brand._id,
      category: category._id,
      images: ['https://example.com/cream.jpg'],
      price: 999,
      mrp: 1200,
      discount: 16,
      sku: 'SKU-ACCT-CREAM',
      stock: 40,
      rating: 4.5,
      reviewCount: 2,
      isActive: true
    });
    testProductId = product._id.toString();

    // Create Order for User A
    const userA = await User.findOne({ email: 'usera@example.com' });
    const orderA = await Order.create({
      orderNumber: 'GLOW-ORD-USERA-01',
      user: userA!._id,
      items: [
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0]
        }
      ],
      itemsPrice: 999,
      discountAmount: 0,
      deliveryFee: 0,
      totalAmount: 999,
      shippingAddress: {
        name: 'User A',
        phone: '+91 9999999999',
        addressLine: 'Road 1',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      trackingNumber: 'AWB-TEST-001',
      statusHistory: [{ status: 'Confirmed', timestamp: new Date() }]
    });
    userAOrderId = orderA._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({ email: /user[ab]@example\.com/ });
    await Product.deleteMany({ slug: 'account-test-cream' });
    await Category.deleteMany({ slug: 'account-test-cat' });
    await Brand.deleteMany({ slug: 'account-test-brand' });
    await Order.deleteMany({ orderNumber: 'GLOW-ORD-USERA-01' });
    await Review.deleteMany({});
    await disconnectDB();
  });

  it('1. Should update customer profile details', async () => {
    const res = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        firstName: 'UserA-Updated',
        phone: '+91 9998887776',
        preferences: { skinType: 'Oily' }
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.user.firstName).toBe('UserA-Updated');
  });

  it('2. Should prevent customer from changing role to admin via profile API', async () => {
    const res = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ role: 'admin' })
      .expect(200);

    expect(res.body.user.role).toBe('customer'); // Role remains customer
  });

  it('3. Should allow User A to fetch their own order details', async () => {
    const res = await request(app)
      .get(`/api/orders/${userAOrderId}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.order.orderNumber).toBe('GLOW-ORD-USERA-01');
  });

  it('4. Should DENY User B from accessing User A order details (Ownership Protection)', async () => {
    const res = await request(app)
      .get(`/api/orders/${userAOrderId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(404); // Returns not found or access denied for unauthorized user

    expect(res.body.success).toBe(false);
  });

  it('5. Should allow customer to cancel an eligible order', async () => {
    const res = await request(app)
      .put(`/api/orders/${userAOrderId}/cancel`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ reason: 'Found better price elsewhere' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.order.orderStatus).toBe('Cancelled');
  });

  it('6. Should reject return request if order is not delivered', async () => {
    const res = await request(app)
      .post('/api/returns')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        orderId: userAOrderId,
        reason: 'Defective product'
      })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Only delivered orders are eligible');
  });

  it('7. Should submit product review and correctly calculate verified buyer badge on backend', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        productId: testProductId,
        rating: 5,
        title: 'Great face cream!',
        comment: 'Absorbs fast and makes skin soft.'
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.review.isVerifiedPurchase).toBe(false); // Order was cancelled, so not verified purchase
  });
});

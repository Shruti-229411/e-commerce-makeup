import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';
import Product from '../models/Product';
import Category from '../models/Category';
import Brand from '../models/Brand';

describe('Phase 4 — Product Catalog & Discovery API Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('1. Should return paginated products catalog', async () => {
    const res = await request(app).get('/api/products').expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.totalProducts).toBeGreaterThanOrEqual(0);
  });

  it('2. Should filter products by price range', async () => {
    const res = await request(app)
      .get('/api/products?minPrice=500&maxPrice=2000')
      .expect(200);

    expect(res.body.success).toBe(true);
    res.body.products.forEach((p: any) => {
      expect(p.price).toBeGreaterThanOrEqual(500);
      expect(p.price).toBeLessThanOrEqual(2000);
    });
  });

  it('3. Should search products by keyword', async () => {
    const res = await request(app)
      .get('/api/products/search?q=lipstick')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.suggestions)).toBe(true);
  });

  it('4. Should fetch featured products', async () => {
    const res = await request(app).get('/api/products/featured').expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('5. Should fetch category tree', async () => {
    const res = await request(app).get('/api/categories').expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  it('6. Should fetch brand listing with product count', async () => {
    const res = await request(app).get('/api/brands').expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.brands)).toBe(true);
  });
});

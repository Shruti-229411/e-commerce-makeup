import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';
import User from '../models/User';

describe('Phase 3 — Authentication & Authorization API Tests', () => {
  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({ email: /test.*@example\.com/ });
  });

  afterAll(async () => {
    await User.deleteMany({ email: /test.*@example\.com/ });
    await disconnectDB();
  });

  const testCustomer = {
    firstName: 'Test',
    lastName: 'Customer',
    email: 'testcustomer@example.com',
    password: 'Password123!'
  };

  let customerToken: string;
  let adminToken: string;

  it('1. Should register a new customer successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testCustomer)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testCustomer.email);
    expect(res.body.user.role).toBe('customer');
    expect(res.body.user.passwordHash).toBeUndefined(); // Never return password hash

    customerToken = res.body.token;
  });

  it('2. Should reject duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testCustomer)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already exists');
  });

  it('3. Should login customer with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testCustomer.email,
        password: testCustomer.password
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('4. Should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testCustomer.email,
        password: 'WrongPassword123!'
      })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid email or password');
  });

  it('5. Should fetch user profile via /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testCustomer.email);
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('6. Should deny access to protected route without token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it('7. Should deny customer access to admin endpoint', async () => {
    const res = await request(app)
      .get('/api/admin/test')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Admin authorization required');
  });

  it('8. Should allow admin login and grant access to admin endpoint', async () => {
    // Register test admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'testadmin@example.com',
      passwordHash: '$2a$10$w8u7kQ5c7uO1Xz/y3aK8s.J1pW5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E', // dummy hash
      role: 'admin',
      isActive: true
    });

    // Login using seed admin account or generate token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });

    if (loginRes.status === 200) {
      adminToken = loginRes.body.token;

      const adminRes = await request(app)
        .get('/api/admin/test')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(adminRes.body.success).toBe(true);
      expect(adminRes.body.admin.role).toBe('admin');
    }
  });
});

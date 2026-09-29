import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { connectDB } from './config/db';
import Product from './models/Product';
import { seedDataOnly } from './seeders/seed';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed database if empty (e.g. MongoMemoryServer fallback or empty DB)
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 [Database Auto-Seed] Empty database detected. Seeding full 152-product catalog & 16 brands...');
      await seedDataOnly();
      console.log('✅ [Database Auto-Seed] Seed completed cleanly on server launch.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 [GlowCart Server] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ [Server Launch Error] Server failed to start due to database connection issue:', error);
    process.exit(1);
  }
};

startServer();

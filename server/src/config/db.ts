import mongoose from 'mongoose';

let mongoMemoryInstance: any = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/GlowCartDB';
  const isAtlas = mongoUri.includes('mongodb.net');
  const isTest = process.env.NODE_ENV === 'test';

  try {
    console.log(`[Database] Connecting to MongoDB (${isAtlas ? 'MongoDB Atlas Cloud Cluster' : 'Local Instance'})...`);

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: isTest ? 1500 : 5000 // Fast timeout in tests to fallback immediately if local mongo is off
    });

    console.log(`✅ [Database Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.warn(`⚠️ [Database Warning] Initial connection to ${mongoUri} failed: ${error.message}`);

    if (isAtlas) {
      console.error(`❌ [Atlas Error] Could not connect to MongoDB Atlas. Check your MONGODB_URI & IP Whitelist in Atlas.`);
      throw error;
    }

    // Launch embedded MongoMemoryServer for instant testing & development fallback
    try {
      console.log('🔄 [Database Fallback] Starting embedded local MongoDB server...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryInstance = await MongoMemoryServer.create({
        instance: { launchTimeout: 30000 }
      });
      mongoUri = mongoMemoryInstance.getUri();

      const conn = await mongoose.connect(mongoUri, { autoIndex: true });
      console.log(`✅ [Database Connected - Embedded Instance] URI: ${mongoUri}`);
      return conn;
    } catch (fallbackErr: any) {
      console.error(`❌ [Database Error] Failed to launch embedded MongoDB: ${fallbackErr.message}`);
      throw fallbackErr;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryInstance) {
      await mongoMemoryInstance.stop();
      mongoMemoryInstance = null;
    }
    console.log('[Database] Disconnected from MongoDB cleanly.');
  } catch (error: any) {
    console.error(`[Database Error] Error disconnecting: ${error.message}`);
  }
};

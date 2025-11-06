import mongoose from 'mongoose';

export const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI in your environment.');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

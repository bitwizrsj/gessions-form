import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ email: { $regex: new RegExp('^aasha\\.soni@poornima\\.edu\\.in$', 'i') } });
    if (user) {
      console.log('USER_FOUND:', JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt
      }, null, 2));
    } else {
      console.log('USER_NOT_FOUND');
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

check();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('users').updateOne(
      { email: { $regex: new RegExp('^aasha\\.soni@poornima\\.edu\\.in$', 'i') } },
      { $set: { isVerified: true, otp: null, otpExpires: null } }
    );
    console.log('UPDATE_RESULT:', JSON.stringify(result));
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

verify();

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected successfully 🚀')
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        process.exit(1)
    }
}

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);


    console.log(`MongoDB Connected ✅: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error.message);
    process.exit(1);
  }


module.exports = connectDB;
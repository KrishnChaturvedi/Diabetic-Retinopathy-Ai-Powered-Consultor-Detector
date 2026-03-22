const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        // log host when connected
        const host = mongoose.connection.host
        console.log(`MongoDB connected successfully: ${host}`)
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        process.exit(1)
    }
}
module.exports = connectDB;
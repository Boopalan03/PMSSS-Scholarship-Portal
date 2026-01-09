const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Force IPv4 loopback to avoid connection issues
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pmsss_db');
        console.log(`🔥 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
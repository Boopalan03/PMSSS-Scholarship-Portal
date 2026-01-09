const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); 

// Load env variables to get MONGO_URI
dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔥 MongoDB Connected');

        // --- CONFIGURATION ---
        const adminEmail = "admin@pmsss.com";
        const adminPassword = "admin123"; 
        // ---------------------
        
        // Check if admin already exists
        const userExists = await User.findOne({ email: adminEmail });
        if (userExists) {
            console.log('⚠️  Admin already exists');
            process.exit();
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create the Admin User
        await User.create({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin" // This is the only place "admin" is allowed
        });

        console.log('✅ Admin Account Created Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
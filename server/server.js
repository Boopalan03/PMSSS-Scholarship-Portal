const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- CRITICAL IMPORT
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

// Routes Import
const authRoutes = require('./routes/authRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');

dotenv.config();

// 1. Connect to Database
connectDB();

const app = express();

// 2. MIDDLEWARE (The Fix is Here)
// Allow React (localhost:3000) to talk to this Server
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// 3. Create uploads folder if missing
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static('uploads'));

// 4. Debugging Route (Check if server is alive)
app.get('/', (req, res) => {
    res.send('API is Running...');
});

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarship', scholarshipRoutes);

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
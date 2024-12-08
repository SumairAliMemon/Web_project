// Load environment variables before other imports
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const hostelRoutes = require('./Routes/hostelRoutes');
const UserRoutes = require('./Routes/userRoutes');
const cancelBookingManager = require('./Routes/cancelBooking.js');
const review = require('./Routes/review.js');
const announcements = require('./Routes/announcement.js');
const complaints = require('./Routes/complaints.js');
const cors = require('cors');


// Initialize Express app
const app = express();

// Load environment variables from the .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Environment variable check for required variables
const envCheck = {
    jwtSecretExists: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    currentDirectory: __dirname,
    envPath: path.join(__dirname, '.env'),
};

console.log('Environment Check:', envCheck);

// If JWT_SECRET is missing, exit the application
if (!process.env.JWT_SECRET) {
    console.error('Critical Error: JWT_SECRET is not defined in environment variables.');
    console.error('Please ensure the .env file exists at:', path.join(__dirname, '.env'));
    process.exit(1); // Exit the application if JWT_SECRET is missing
}

// Middleware for parsing JSON data
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI; // MongoDB connection string from .env
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1); // Exit the application if MongoDB connection fails
    }
};

// Call the function to connect to MongoDB
connectDB();


app.use(cors());

// Or enable CORS for a specific origin
app.use(cors({
  origin: "http://localhost:5173" // Replace with your frontend URL
}));

app.use('/api/hostels', hostelRoutes);
app.use('/api/User', UserRoutes);
app.use('/api/cancelBooking', cancelBookingManager);
app.use('/api/review', review);
app.use('/api/announcements', announcements);
app.use('/api/review', review);
app.use('/api/complaints', complaints);




// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Environment Status:', {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'is set' : 'not set',
        MONGODB_URI: process.env.MONGODB_URI ? 'MongoDB URI is set' : 'MongoDB URI not set',
        PORT: PORT,

    });

    console.log (process.env.MONGODB_URI );
});

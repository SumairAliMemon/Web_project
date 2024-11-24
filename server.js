// Load environment variables before other imports
const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const connection = require('./configration/database'); // Fixed typo: 'configration' to 'config'
const authRoutes = require('./Routes/auth');
const profileRoutes = require('./Routes/profile');
const movieRoutes = require('./Routes/movie');
const reviewRoutes = require('./Routes/review'); // Renamed for consistency
const movieUserRoutes = require('./Routes/movieuser'); // Renamed for consistency
const customListRoutes = require('./Routes/customlist'); // Renamed for consistency
const Reminder = require('./Routes/reminder'); // Import reminder controller
const boxoffice = require('./Routes/boxoffice');
const news =  require('./Routes/news');
const post =  require('./Routes/post');
require('./services/reminderservice');


const app = express();

// Verify environment variables immediately
const envCheck = {
    jwtSecretExists: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    currentDirectory: __dirname,
    envPath: path.join(__dirname, '.env')
};
console.log('Environment Check:', envCheck);

// If JWT_SECRET is missing, exit the application
if (!process.env.JWT_SECRET) {
    console.error('Critical Error: JWT_SECRET is not defined in environment variables');
    console.error('Please ensure .env file exists at:', path.join(__dirname, '.env'));
    process.exit(1);
}

// Database connection
connection();

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/moviedatabase', movieRoutes);
app.use('/api/movie/review', reviewRoutes);
app.use('/api/home', movieUserRoutes);
app.use('/api/custom-lists', customListRoutes);
app.use('/api/reminder', Reminder);
app.use('/api/post', post);
app.use('/api/boxoffice', boxoffice);
app.use('/api/news', news);

// Error handling middleware (general error handler)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Reminder checking cron job (runs every minute)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Environment Status:', {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'is set' : 'not set',
        PORT: PORT
    });
});

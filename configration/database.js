const mongoose = require('mongoose');

const connection = async () => {
    try {
    
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 50000, // Increased connection timeout
            socketTimeoutMS: 45000
        });
        
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connection;
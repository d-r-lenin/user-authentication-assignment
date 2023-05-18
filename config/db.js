const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userAuth';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            // The following prevents warnings in the console
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        // reconnection in 12 seconds
        setTimeout(() => connectDB() , 12000)
    }
}


module.exports = connectDB;
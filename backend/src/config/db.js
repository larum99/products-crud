const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to app_crud DB on MongoDB Atlas: ${conn.connection.host}`);
        return conn
    } catch (error) {
        console.error("Error to connect to the DB:", error.message);
        throw error;
    }
};

module.exports = connectDB;
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
dns.setServers(['1.1.1.1', '8.8.8.8']);
const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectDB;
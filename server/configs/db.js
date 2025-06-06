import mongoose from "mongoose";

const connectDB = async () => {
    try {
         mongoose.connection.on('connected',()=> console.log("database connected"));
         await mongoose.connect(`${process.env.MONGODB_URI}/green_nest`, )
      
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

export default connectDB;
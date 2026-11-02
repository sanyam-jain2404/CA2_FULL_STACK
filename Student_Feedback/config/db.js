import mongoose from "mongoose";

const connectDB = async (uri) => {
    try {
        
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error.message);
    }
};
export default connectDB;
import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to MongoDB"); 
    } catch (error) {
        console.error("Could not connect to MongoDB server", error)
        process.exit(1)
    }
}


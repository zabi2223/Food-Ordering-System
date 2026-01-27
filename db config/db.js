import mongoose from "mongoose";

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("monogdb connection successfully");
    }
    catch (error) {

        console.error("mongodb is not connected");
    }

}
export default connectToDb;
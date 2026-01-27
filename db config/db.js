import mongoose from "mongoose";

const connectToDb = async () => {
    try {
        await mongoose.connect("process.env.MongoDB_URL")
        console.log("monogdb connection successfully");
    }
    catch (error) {

        console.error("mongodb is not connected");
    }

}
export default connectToDb;
import mongoose from 'mongoose';

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection Successful");
    } catch (error) {
        console.log("Connection failed");
    }
};

export default connection;
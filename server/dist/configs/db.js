import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB connected'));
        await mongoose.connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.error("Error connecting MongoDB:", error);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map
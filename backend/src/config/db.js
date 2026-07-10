import mongoose from "mongoose";

// Connects the API to MongoDB using the future .env value supplied by the owner.
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    // Fail loudly in development when the connection string is missing.
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing. Add it to backend/.env.");
    }

    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

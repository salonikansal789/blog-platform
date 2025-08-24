import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "";

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB Connected: ${connection.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

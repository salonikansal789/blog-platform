import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://salonikansal789:saloni@cluster0.ji59ihu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

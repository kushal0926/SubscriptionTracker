import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/env.ts";

if (!MONGODB_URI) {
  // making it throw an error if the mongodb uri is empty inside the environment variable
  throw new Error(
    "PLEASE DEFINE THE MONGODB_URI ENVIRONMENT VARIABLE INSIDE .env.<development/production>.local",
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log(`CONNECTED TO MONGODB DATABASE IN ${NODE_ENV} mode`);
  } catch (error) {
    console.log("Error connceting to database:", error);
    process.exit(1); // existing the process with failure
  }
};

export default connectToDatabase;

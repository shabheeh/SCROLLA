import mongoose, { ConnectOptions} from "mongoose";

const mongoUri = process.env.MONGO_URI!;

const connectDB = async (): Promise<void> => {
    try {
      await mongoose.connect(mongoUri, {} as ConnectOptions);
      console.info("Connected to MongoDB");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    }
  };
  
  export default connectDB;
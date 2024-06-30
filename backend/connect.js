import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = "mongodb://localhost:27017"; // MongoDB connection string
    await mongoose.connect(mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

export default connectDB;

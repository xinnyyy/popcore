import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = "mongodb+srv://hoxinyi0505:<jQaKYYLWuhpYHg8y>@popcore.2awki7i.mongodb.net/?retryWrites=true&w=majority&appName=Popcore";
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

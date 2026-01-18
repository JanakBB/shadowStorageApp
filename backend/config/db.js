import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017");
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("Database Disconnected");
    process.exit(0);
  });
}

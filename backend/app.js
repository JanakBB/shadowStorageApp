import env from "./config/env.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";

await connectDB();

const app = express();

const PORT = env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com", "https://www.yourdomain.com"]
        : ["http://localhost:5173"],
    credentials: true,
  }),
);

app.get("/", (req, res, next) => {
  res.status(200).json({
    name: "Backend",
    message: "Check Server Running",
  });
});

app.use("/auth", authRoutes);
app.use("/", userRoutes);

// Error Handling phase
// 1. Route not found
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// 2. Globally catch error
app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Something went wrong",
    stack: error.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

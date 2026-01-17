import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com", "https://www.yourdomain.com"]
        : ["http://localhost:5173"],
    credentials: process.env.NODE_ENV === "production" || true,
  })
);

app.get("/", (req, res, next) => {
  res.status(200).json({
    name: "Backend",
    message: "Check Server Running",
  });
});

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

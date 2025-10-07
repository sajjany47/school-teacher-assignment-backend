import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRoutes from "./routes/user.routes.js";
import assignmentRouter from "./routes/assignment.routes.js";

dotenv.config({ quiet: true });
const app = express();

// Middleware
app.use(express.json({ limit: "100mb" }));

app.use(
  cors({
    origin: "*",
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: "Invalid JSON",
      message:
        "The provided JSON is not correctly formatted. Please check your JSON syntax.",
    });
  }

  next(err);
});

// Routes
app.use("/user", UserRoutes);
app.use("/assigment", assignmentRouter);

// Connect DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.mongodb_url)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

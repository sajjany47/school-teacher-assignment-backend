import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    name: String,
    position: {
      type: String,
      trim: true,
      enum: ["teacher", "student"],
    },
    email: { type: String, trim: true, lowercase: true },
    password: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userModel);

export default User;

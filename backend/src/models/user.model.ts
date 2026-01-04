import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 2 },
    lastName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["client", "provider", "admin"], default: "client" },
    profession: { type: String },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);

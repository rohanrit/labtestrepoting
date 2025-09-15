import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

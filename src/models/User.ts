import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    emailVerified: { type: Date, default: null },
    // name: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    // emailVerified: { type: Date, default: null },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Prevent model overwrite in dev environments
export const User = mongoose.models.User || mongoose.model('User', UserSchema);


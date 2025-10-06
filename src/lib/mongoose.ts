import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// ✅ Extend the global type safely for mongoose caching
declare global {
  // Avoid redeclaration errors by allowing undefined
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// ✅ Initialize the cache properly
const cached = global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

export async function connectMongo(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };

    // ✅ Explicitly type the promise to avoid mismatch
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Default export (for standard import style)
export default connectMongo;

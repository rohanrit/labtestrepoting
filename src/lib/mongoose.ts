import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithCache = globalThis as typeof globalThis & { mongoose?: MongooseCache };
const cached: MongooseCache = globalWithCache.mongoose ?? { conn: null, promise: null };
if (!globalWithCache.mongoose) {
  globalWithCache.mongoose = cached;
}

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

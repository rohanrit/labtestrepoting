import dbConnect from "@/lib/mongoose";

export async function GET() {
  try {
    await dbConnect();
    return new Response(JSON.stringify({ success: true, message: 'Connected to MongoDB' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'DB connection failed-'+ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("name username email");

    const safeUsers = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      username: u.username,
      email: u.email
    }));

    return NextResponse.json({ users: safeUsers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

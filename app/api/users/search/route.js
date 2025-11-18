import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    if (!q.trim()) {
      return NextResponse.json({ users: [] });
    }
    const pattern = new RegExp(q.trim(), "i");
    const users = await User.find({
      $or: [{ username: pattern }, { name: pattern }]
    })
      .limit(20)
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

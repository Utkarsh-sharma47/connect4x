import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const existing = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existing) {
      return NextResponse.json(
        { message: "User with this email or username already exists." },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      username,
      email,
      password
    });

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email
    };

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

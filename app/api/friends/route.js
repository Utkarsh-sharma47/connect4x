import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }
    const user = await User.findById(userId).populate(
      "friends",
      "name username email"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const friends = (user.friends || []).map((f) => ({
      id: f._id.toString(),
      name: f.name,
      username: f.username,
      email: f.email
    }));
    return NextResponse.json({ friends });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId, friendId } = await req.json();
    if (!userId || !friendId) {
      return NextResponse.json(
        { message: "userId and friendId are required" },
        { status: 400 }
      );
    }

    if (userId === friendId) {
      return NextResponse.json(
        { message: "You cannot add yourself as a friend." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return NextResponse.json(
        { message: "User or friend not found" },
        { status: 404 }
      );
    }

    const already = user.friends.some(
      (id) => id.toString() === friendId.toString()
    );
    if (!already) {
      user.friends.push(friendId);
      await user.save();
    }

    return NextResponse.json({ message: "Friend added" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

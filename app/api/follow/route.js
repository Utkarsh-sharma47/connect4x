import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Follow from "@/models/Follow";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const followerUsername = searchParams.get("follower");
    const followingUsername = searchParams.get("following");

    if (!followerUsername || !followingUsername) {
      return NextResponse.json(
        { message: "follower and following are required" },
        { status: 400 }
      );
    }

    const followerUser = await User.findOne({ username: followerUsername });
    const followingUser = await User.findOne({ username: followingUsername });

    if (!followerUser || !followingUser) {
      return NextResponse.json({ following: false });
    }

    const existing = await Follow.findOne({
      follower: followerUser._id,
      following: followingUser._id
    });

    return NextResponse.json({ following: Boolean(existing) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { followerUsername, followingUsername } = await req.json();

    if (!followerUsername || !followingUsername) {
      return NextResponse.json(
        { message: "followerUsername and followingUsername are required" },
        { status: 400 }
      );
    }

    if (followerUsername === followingUsername) {
      return NextResponse.json(
        { message: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    const followerUser = await User.findOne({ username: followerUsername });
    const followingUser = await User.findOne({ username: followingUsername });

    if (!followerUser || !followingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existing = await Follow.findOne({
      follower: followerUser._id,
      following: followingUser._id
    });

    if (existing) {
      await Follow.deleteOne({ _id: existing._id });
      return NextResponse.json({ following: false });
    }

    await Follow.create({
      follower: followerUser._id,
      following: followingUser._id
    });

    return NextResponse.json({ following: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


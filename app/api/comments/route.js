import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("post");

    if (!postId) {
      return NextResponse.json(
        { message: "post query parameter is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ post: postId })
      .populate("user", "username name")
      .sort({ createdAt: 1 });

    const formatted = comments.map((c) => ({
      id: c._id.toString(),
      content: c.content,
      createdAt: c.createdAt,
      username: c.user?.username || "unknown",
      name: c.user?.name || c.user?.username || "unknown"
    }));

    return NextResponse.json({ comments: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { postId, userId, content } = await req.json();

    if (!postId || !userId || !content?.trim()) {
      return NextResponse.json(
        { message: "postId, userId and content are required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      return NextResponse.json({ message: "Post or user not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      post: post._id,
      user: user._id,
      content: content.trim()
    });

    return NextResponse.json(
      {
        comment: {
          id: comment._id.toString(),
          content: comment.content,
          createdAt: comment.createdAt,
          username: user.username,
          name: user.name || user.username
        }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


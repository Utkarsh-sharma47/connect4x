import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    await connectDB();

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json(
        { message: "postId is required." },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    post.likes += 1;
    await post.save();

    return NextResponse.json({
      post: {
        id: post._id.toString(),
        content: post.content,
        likes: post.likes,
        createdAt: post.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

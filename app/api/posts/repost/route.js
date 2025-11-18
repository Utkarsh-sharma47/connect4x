import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return NextResponse.json(
        { message: "postId and userId are required." },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const alreadyReposted = post.reposts.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyReposted) {
      post.reposts = post.reposts.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.reposts.push(userId);
    }

    await post.save();

    return NextResponse.json({
      post: {
        id: post._id.toString(),
        reposts: post.reposts.map((id) => id.toString()),
        repostCount: post.reposts.length,
        reposted: !alreadyReposted
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


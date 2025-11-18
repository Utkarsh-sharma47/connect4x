import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    let filter = {};
    if (username) {
      const user = await User.findOne({ username });
      if (!user) {
        return NextResponse.json({ posts: [] });
      }
      filter.author = user._id;
    }

    const posts = await Post.find(filter)
      .populate("author", "username name")
      .sort({ createdAt: -1 });

    const formatted = posts.map((p) => ({
      id: p._id.toString(),
      content: p.content,
      likes: p.likes,
      createdAt: p.createdAt,
      authorName: p.author?.username || p.author?.name || "unknown"
    }));

    return NextResponse.json({ posts: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { authorId, content } = await req.json();

    if (!authorId || !content) {
      return NextResponse.json(
        { message: "Missing fields." },
        { status: 400 }
      );
    }

    const author = await User.findById(authorId);
    if (!author) {
      return NextResponse.json(
        { message: "Author not found." },
        { status: 404 }
      );
    }

    const post = await Post.create({
      content,
      author: author._id,
      likes: 0
    });

    return NextResponse.json(
      {
        post: {
          id: post._id.toString(),
          content: post.content,
          likes: post.likes,
          createdAt: post.createdAt,
          authorName: author.username || author.name
        }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

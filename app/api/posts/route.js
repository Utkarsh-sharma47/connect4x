import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Comment from "@/models/Comment";

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

    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } }
    ]);
    const commentCountMap = commentCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const formatted = posts.map((p) => ({
      id: p._id.toString(),
      content: p.content,
      likes: p.likes?.map((id) => id.toString()) || [],
      reposts: p.reposts?.map((id) => id.toString()) || [],
      likeCount: p.likes?.length || 0,
      repostCount: p.reposts?.length || 0,
      commentCount: commentCountMap[p._id.toString()] || 0,
      createdAt: p.createdAt,
      authorName: p.author?.username || p.author?.name || "unknown",
      authorUsername: p.author?.username || "unknown"
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
      likes: [],
      reposts: []
    });

    return NextResponse.json(
      {
        post: {
          id: post._id.toString(),
          content: post.content,
          likes: [],
          reposts: [],
          likeCount: 0,
          repostCount: 0,
          commentCount: 0,
          createdAt: post.createdAt,
          authorName: author.username || author.name,
          authorUsername: author.username || author.name
        }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

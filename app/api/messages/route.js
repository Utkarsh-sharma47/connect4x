import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Message from "@/models/Message";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const selfUsername = searchParams.get("self");
    const otherUsername = searchParams.get("other");

    if (!selfUsername || !otherUsername) {
      return NextResponse.json(
        { message: "self and other are required" },
        { status: 400 }
      );
    }

    const selfUser = await User.findOne({ username: selfUsername });
    const otherUser = await User.findOne({ username: otherUsername });

    if (!selfUser || !otherUser) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await Message.find({
      $or: [
        { sender: selfUser._id, receiver: otherUser._id },
        { sender: otherUser._id, receiver: selfUser._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username")
      .populate("receiver", "username");

    const formatted = messages.map((m) => ({
      id: m._id.toString(),
      content: m.content,
      createdAt: m.createdAt,
      senderUsername: m.sender?.username,
      receiverUsername: m.receiver?.username
    }));

    return NextResponse.json({ messages: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { selfUsername, toUsername, content } = await req.json();
    if (!selfUsername || !toUsername || !content) {
      return NextResponse.json(
        { message: "selfUsername, toUsername and content are required" },
        { status: 400 }
      );
    }

    const sender = await User.findOne({ username: selfUsername });
    const receiver = await User.findOne({ username: toUsername });
    if (!sender || !receiver) {
      return NextResponse.json(
        { message: "Sender or receiver not found" },
        { status: 404 }
      );
    }

    const message = await Message.create({
      sender: sender._id,
      receiver: receiver._id,
      content
    });

    return NextResponse.json({
      message: {
        id: message._id.toString(),
        content: message.content,
        createdAt: message.createdAt,
        senderUsername: sender.username,
        receiverUsername: receiver.username
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

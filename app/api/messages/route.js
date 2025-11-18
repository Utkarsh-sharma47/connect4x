import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Message from "@/models/Message";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const self = searchParams.get("self");
  const other = searchParams.get("other");

  const selfUser = await User.findOne({ username: self });
  const otherUser = await User.findOne({ username: other });

  if (!selfUser || !otherUser) {
    return NextResponse.json({ messages: [] });
  }

  const messages = await Message.find({
    $or: [
      { sender: selfUser._id, receiver: otherUser._id },
      { sender: otherUser._id, receiver: selfUser._id },
    ],
  })
    .populate("sender", "username")
    .populate("receiver", "username")
    .sort({ createdAt: 1 });

  const formatted = messages.map((m) => ({
    id: m._id.toString(),
    content: m.content,
    createdAt: m.createdAt,
    senderUsername: m.sender.username,
    receiverUsername: m.receiver.username,
  }));

  return NextResponse.json({ messages: formatted });
}

export async function POST(req) {
  await connectDB();

  const { selfUsername, toUsername, content } = await req.json();

  const senderUser = await User.findOne({ username: selfUsername });
  const receiverUser = await User.findOne({ username: toUsername });

  if (!senderUser || !receiverUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const message = await Message.create({
    sender: senderUser._id,
    receiver: receiverUser._id,
    content,
  });

  return NextResponse.json({
    message: {
      id: message._id.toString(),
      content: message.content,
      createdAt: message.createdAt,
      senderUsername: senderUser.username,
      receiverUsername: receiverUser.username,
    },
  });
}

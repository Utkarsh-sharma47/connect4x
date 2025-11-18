"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ChatWithUserPage() {
  const params = useParams();
  const otherUsername = params?.username;
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("connect4x:user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!otherUsername) return;
    async function fetchUserAndMessages() {
      try {
        const userRes = await fetch(`/api/users/one?username=${otherUsername}`);
        const userData = await userRes.json();
        if (userRes.ok) {
          setOtherUser(userData.user);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserAndMessages();
  }, [otherUsername]);

  useEffect(() => {
    if (!currentUser || !otherUsername) return;
    async function fetchMessages() {
      try {
        const msgRes = await fetch(
          `/api/messages?self=${encodeURIComponent(
            currentUser.username
          )}&other=${encodeURIComponent(otherUsername)}`
        );
        const msgData = await msgRes.json();
        if (msgRes.ok) {
          setMessages(msgData.messages || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [currentUser, otherUsername]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !otherUser || !currentUser) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selfUsername: currentUser.username,
          toUsername: otherUser.username,
          content: content.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setContent("");
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ fontSize: "0.9rem" }}>Loading chat...</p>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="card">
        <p style={{ fontSize: "0.9rem" }}>User not found.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: "grid", gap: "0.8rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem"
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 30% 30%, #38bdf8, #a855f7)"
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
            {otherUser.name}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            @{otherUser.username}
          </div>
        </div>
      </div>
      <div
        style={{
          borderRadius: 14,
          border: "1px solid #1f2937",
          padding: "0.6rem",
          height: 260,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          background: "#020617"
        }}
      >
        {messages.length === 0 && (
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            No messages yet. Say hi 👋
          </p>
        )}
        {messages.map((m) => {
          const mine = currentUser && m.senderUsername === currentUser.username;
          return (
            <div
              key={m.id}
              style={{
                alignSelf: mine ? "flex-end" : "flex-start",
                maxWidth: "75%",
                borderRadius: 12,
                padding: "0.35rem 0.6rem",
                background: mine ? "#4f46e5" : "#111827",
                color: "#e5e7eb",
                fontSize: "0.85rem"
              }}
            >
              <p>{m.content}</p>
              <p
                style={{
                  fontSize: "0.65rem",
                  marginTop: 2,
                  opacity: 0.8,
                  textAlign: "right"
                }}
              >
                {new Date(m.createdAt).toLocaleTimeString()}
              </p>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center"
        }}
      >
        <input
          className="input"
          placeholder="Type a message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

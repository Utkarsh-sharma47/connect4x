"use client";

import { useState } from "react";

export default function NewPostForm({ currentUser }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: currentUser.id,
          content: content.trim()
        })
      });
      setContent("");
      window.dispatchEvent(new Event("connect4x:posts-updated"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.6rem" }}>
      <textarea
        className="textarea"
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
          Posting as <strong>@{currentUser.username}</strong> ·{" "}
          {content.length}/280
        </span>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

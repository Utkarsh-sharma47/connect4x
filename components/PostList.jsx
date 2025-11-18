"use client";

import { useEffect, useState } from "react";

export default function PostList({ filterByUsername }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    try {
      const url = filterByUsername
        ? `/api/posts?username=${encodeURIComponent(filterByUsername)}`
        : "/api/posts";
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [filterByUsername]);

  useEffect(() => {
    const handler = () => fetchPosts();
    window.addEventListener("connect4x:posts-updated", handler);
    return () => window.removeEventListener("connect4x:posts-updated", handler);
  });

  const handleLike = async (postId) => {
    try {
      await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Loading posts...</p>
    );
  }

  if (!posts.length) {
    return (
      <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
        No posts yet. Be the first to share something!
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.7rem" }}>
      {posts.map((post) => (
        <article
          key={post.id}
          style={{
            border: "1px solid #1f2937",
            borderRadius: 14,
            padding: "0.6rem 0.75rem",
            backgroundColor: "#020617"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.3rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "999px",
                  background: "#020617",
                  border: "1px solid #1f2937"
                }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.87rem" }}>
                  {post.authorName}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#e5e7eb",
              marginBottom: "0.4rem"
            }}
          >
            {post.content}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.8rem"
            }}
          >
            <button
              type="button"
              onClick={() => handleLike(post.id)}
              className="btn-ghost"
              style={{ padding: "0.2rem 0.6rem", borderRadius: 999 }}
            >
              ❤️ Like
            </button>
            <span style={{ color: "#9ca3af" }}>
              {post.likes} like{post.likes === 1 ? "" : "s"}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

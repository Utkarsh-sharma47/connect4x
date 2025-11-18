"use client";

import { useEffect, useState } from "react";

export default function PostList({ filterByUsername }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("connect4x:user");
    if (!stored) {
      setCurrentUser(null);
      return;
    }
    try {
      setCurrentUser(JSON.parse(stored));
    } catch {
      setCurrentUser(null);
    }
  }, []);

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

  const updatePost = (postId, updater) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...updater(post) } : post))
    );
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      console.warn("Must be logged in to like posts");
      return;
    }
    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUser.id })
      });
      const data = await res.json();
      if (res.ok) {
        updatePost(postId, () => ({
          likes: data.post.likes,
          likeCount: data.post.likeCount
        }));
      } else {
        console.error("Failed to like post", data?.message || data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRepost = async (postId) => {
    if (!currentUser) {
      console.warn("Must be logged in to repost");
      return;
    }
    try {
      const res = await fetch("/api/posts/repost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUser.id })
      });
      const data = await res.json();
      if (res.ok) {
        updatePost(postId, () => ({
          reposts: data.post.reposts,
          repostCount: data.post.repostCount
        }));
      } else {
        console.error("Failed to repost", data?.message || data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`/api/comments?post=${postId}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => {
      const next = { ...prev, [postId]: !prev[postId] };
      if (!prev[postId]) {
        fetchComments(postId);
      }
      return next;
    });
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    if (!currentUser) {
      console.warn("Must be logged in to comment");
      return;
    }
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    setCommentLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: currentUser.id,
          content: text
        })
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => {
          const existing = prev[postId] || [];
          return { ...prev, [postId]: [...existing, data.comment] };
        });
        updatePost(postId, (post) => ({
          commentCount: (post.commentCount || 0) + 1
        }));
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      } else {
        console.error("Failed to add comment", data?.message || data);
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
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
      {posts.map((post) => {
        const liked =
          currentUser && post.likes?.some((id) => id === currentUser.id);
        const reposted =
          currentUser && post.reposts?.some((id) => id === currentUser.id);
        const commentList = comments[post.id] || [];
        const commentsOpen = openComments[post.id];
        return (
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
              fontSize: "0.8rem",
              flexWrap: "wrap"
            }}
          >
            <button
              type="button"
              onClick={() => handleLike(post.id)}
              className="btn-ghost"
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: 999,
                backgroundColor: liked ? "rgba(79,70,229,0.2)" : "transparent",
                color: liked ? "#a855f7" : "inherit"
              }}
            >
              ❤️ {liked ? "Liked" : "Like"}
            </button>
            <span style={{ color: "#9ca3af" }}>
              {post.likeCount || 0} like{(post.likeCount || 0) === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={() => handleRepost(post.id)}
              className="btn-ghost"
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: 999,
                backgroundColor: reposted ? "rgba(56,189,248,0.2)" : "transparent",
                color: reposted ? "#38bdf8" : "inherit"
              }}
            >
              🔁 {reposted ? "Reposted" : "Repost"}
            </button>
            <span style={{ color: "#9ca3af" }}>
              {post.repostCount || 0} repost
              {(post.repostCount || 0) === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={() => toggleComments(post.id)}
              className="btn-ghost"
              style={{ padding: "0.2rem 0.6rem", borderRadius: 999 }}
            >
              💬 {commentsOpen ? "Hide" : "View"} comments ({post.commentCount || 0})
            </button>
          </div>
          {commentsOpen && (
            <div
              style={{
                marginTop: "0.6rem",
                borderTop: "1px solid #1f2937",
                paddingTop: "0.6rem",
                display: "grid",
                gap: "0.5rem"
              }}
            >
              {commentList.length === 0 && (
                <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  No comments yet.
                </p>
              )}
              {commentList.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    background: "#0f172a",
                    borderRadius: 10,
                    padding: "0.4rem 0.5rem"
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      marginBottom: "0.2rem"
                    }}
                  >
                    @{comment.username} ·{" "}
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>{comment.content}</div>
                </div>
              ))}
              {currentUser && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.4rem",
                    alignItems: "center"
                  }}
                >
                  <input
                    className="input"
                    placeholder="Write a comment"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => handleAddComment(post.id)}
                    disabled={commentLoading[post.id]}
                  >
                    {commentLoading[post.id] ? "Posting..." : "Post"}
                  </button>
                </div>
              )}
            </div>
          )}
        </article>
        );
      })}
    </div>
  );
}

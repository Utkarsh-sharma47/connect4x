"use client";

import { useEffect, useState } from "react";
import PostList from "@/components/PostList";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("connect4x:user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) {
    return (
      <div className="card">
        <p style={{ fontSize: "0.9rem" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: "grid", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 30% 30%, #38bdf8, #4f46e5)"
          }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{user.name}</div>
          <div style={{ color: "#9ca3af" }}>@{user.username}</div>
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.8rem",
              marginTop: "0.2rem"
            }}
          >
            Your personal profile on Connect4x.
          </div>
        </div>
      </div>
      <div>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            marginBottom: "0.35rem"
          }}
        >
          Your posts
        </h3>
        <PostList filterByUsername={user.username} />
      </div>
    </div>
  );
}

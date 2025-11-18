"use client";

import { useEffect, useState } from "react";
import NewPostForm from "@/components/NewPostForm";
import PostList from "@/components/PostList";

export default function DashboardHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("connect4x:user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="card" style={{ display: "grid", gap: "1rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Home</h2>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            See the latest posts from you and the people you&apos;re
            connected with.
          </p>
        </div>
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem"
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 30%, #38bdf8, #4f46e5)"
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: "#6b7280" }}>@{user.username}</div>
            </div>
          </div>
        )}
      </header>
      <NewPostForm currentUser={user} />
      <PostList />
    </div>
  );
}

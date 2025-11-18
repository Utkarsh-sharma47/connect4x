"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostList from "@/components/PostList";

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username;
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("connect4x:user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!username) return;
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/one?username=${username}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setInfo(data.message || "User not found");
        }
      } catch (err) {
        console.error(err);
        setInfo("Error loading user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  const handleAddFriend = async () => {
    if (!currentUser || !user) return;
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, friendId: user.id })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to add friend");
      } else {
        alert("Added to your friends list!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ fontSize: "0.9rem" }}>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card">
        <p style={{ fontSize: "0.9rem" }}>{info || "User not found"}</p>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === user.username;

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
            Member of Connect4x
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              marginBottom: "0.35rem"
            }}
          >
            About
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            This is a simple profile stub. Extend it later with bios, avatars and more.
          </p>
        </div>
        {!isOwnProfile && currentUser && (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button className="btn-ghost" onClick={handleAddFriend}>
              Add to friends
            </button>
            <a href={`/dashboard/chat/${user.username}`}>
              <button className="btn-primary">Message</button>
            </a>
          </div>
        )}
      </div>
      <div>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            marginBottom: "0.35rem"
          }}
        >
          Posts
        </h3>
        <PostList filterByUsername={user.username} />
      </div>
    </div>
  );
}

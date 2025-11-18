"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostList from "@/components/PostList";

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username; // make sure your folder is [username]
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

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

  useEffect(() => {
    if (!currentUser || !user) return;
    if (currentUser.username === user.username) {
      setIsFollowing(false);
      return;
    }
    let ignore = false;
    async function fetchFollowStatus() {
      try {
        const res = await fetch(
          `/api/follow?follower=${encodeURIComponent(
            currentUser.username
          )}&following=${encodeURIComponent(user.username)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore) {
          setIsFollowing(Boolean(data.following));
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch follow status", err);
        }
      }
    }
    fetchFollowStatus();
    return () => {
      ignore = true;
    };
  }, [currentUser, user]);

  const handleToggleFollow = async () => {
    if (!currentUser || !user || currentUser.username === user.username) return;
    setFollowLoading(true);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerUsername: currentUser.username,
          followingUsername: user.username
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsFollowing(Boolean(data.following));
      } else {
        console.error("Failed to update follow status", data?.message || data);
      }
    } catch (err) {
      console.error("Failed to update follow status", err);
    } finally {
      setFollowLoading(false);
    }
  };

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

  const followButtonStyle = {
    border: "none",
    borderRadius: "999px",
    padding: "0.45rem 1.2rem",
    background: "linear-gradient(135deg, #4f46e5, #a855f7)",
    color: "#ffffff",
    fontWeight: 600,
    cursor: followLoading ? "not-allowed" : "pointer",
    opacity: followLoading ? 0.75 : 1,
    transform: "scale(1)",
    transition: "transform 0.2s ease, opacity 0.2s ease"
  };

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
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <button
              type="button"
              style={followButtonStyle}
              disabled={followLoading}
              onClick={handleToggleFollow}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
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

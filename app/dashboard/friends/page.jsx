"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FriendsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("connect4x:user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    async function fetchFriends() {
      try {
        const res = await fetch(`/api/friends?userId=${currentUser.id}`);
        const data = await res.json();
        if (res.ok) {
          setFriends(data.friends || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, [currentUser]);

  return (
    <div className="card" style={{ display: "grid", gap: "0.8rem" }}>
      <div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Friends</h2>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          People you&apos;ve added from their profile pages.
        </p>
      </div>
      {loading && (
        <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Loading...</p>
      )}
      {!loading && friends.length === 0 && (
        <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
          No friends yet. Visit someone&apos;s profile and click &quot;Add to
          friends&quot;.
        </p>
      )}
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {friends.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "999px",
                  background: "#020617",
                  border: "1px solid #1f2937"
                }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {u.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  @{u.username}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <Link href={`/dashboard/user/${u.username}`}>
                <button className="btn-ghost">Profile</button>
              </Link>
              <Link href={`/dashboard/chat/${u.username}`}>
                <button className="btn-primary">Chat</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatLandingPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

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

  const visibleUsers = currentUser
    ? users.filter(
        (u) =>
          u?.id !== currentUser?.id && u?.username !== currentUser?.username
      )
    : users;

  return (
    <div className="card" style={{ display: "grid", gap: "0.8rem" }}>
      <div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Chats</h2>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          Pick someone to start a 1:1 conversation. This is a simple threaded
          message view backed by MongoDB.
        </p>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {visibleUsers.map((u) => (
          <Link key={u.id} href={`/dashboard/chat/${u.username}`}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.45rem 0.6rem",
                borderRadius: 12,
                border: "1px solid #1f2937",
                background: "#020617"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem"
                }}
              >
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
              <span style={{ fontSize: "0.75rem", color: "#38bdf8" }}>
                Message
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

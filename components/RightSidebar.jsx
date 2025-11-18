"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RightSidebar() {
  const [users, setUsers] = useState([]);

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

  return (
    <div
      className="card"
      style={{ position: "sticky", top: 84, display: "grid", gap: "0.8rem" }}
    >
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>People on Connect4x</h3>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          All users who have signed up and are available to chat.
        </p>
      </div>
      <div style={{ display: "grid", gap: "0.45rem" }}>
        {users.length === 0 && (
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            No users yet. Create a couple of test accounts to see them listed.
          </p>
        )}
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  {u.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  @{u.username}
                </div>
              </div>
            </div>
            <Link href={`/dashboard/user/${u.username}`}>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#38bdf8",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
              >
                View
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

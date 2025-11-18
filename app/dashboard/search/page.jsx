"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setResults(data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="card" style={{ display: "grid", gap: "0.8rem" }}>
      <div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Search people</h2>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          Find users by name or username and jump into a profile or chat.
        </p>
      </div>
      <input
        className="input"
        placeholder="Search by name or @username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && (
        <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Searching...</p>
      )}
      {!loading && results.length === 0 && query.trim() && (
        <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
          No users found for &quot;{query.trim()}&quot;.
        </p>
      )}
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {results.map((u) => (
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
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                alignItems: "center",
                fontSize: "0.75rem"
              }}
            >
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

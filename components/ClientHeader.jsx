"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ClientHeader() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  const readUserFromStorage = () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("connect4x:user");
    if (!stored) {
      setUser(null);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.username) {
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    readUserFromStorage();
  }, []);

  // Re-check whenever route changes (so after login redirect it updates)
  useEffect(() => {
    readUserFromStorage();
  }, [pathname]);

  // Also respond to storage changes (other tabs)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => readUserFromStorage();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("connect4x:user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #111827",
        padding: "0.75rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(2,6,23,0.92)",
        backdropFilter: "blur(16px)",
      }}
    >
      <Link
        href="/"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 30% 20%, #e0f2fe, #38bdf8 40%, #4f46e5 70%, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          🦋
        </div>
        <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Connect4x</span>
      </Link>

      {/* NOT LOGGED IN: show Login + Signup */}
      {!user && (
        <nav style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/login">
            <button className="btn-ghost">Log in</button>
          </Link>
          <Link href="/signup">
            <button className="btn-primary">Sign up</button>
          </Link>
        </nav>
      )}

      {/* LOGGED IN: show Open app + Profile + user pill + Logout */}
      {user && (
        <nav
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <Link href="/dashboard">
            <button className="btn-ghost">Open app</button>
          </Link>
          <Link href="/dashboard/profile">
            <button className="btn-ghost">Profile</button>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.75rem",
              borderRadius: 999,
              border: "1px solid #1f2937",
              background: "#020617",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 30%, #38bdf8, #a855f7)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {user.name}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                @{user.username}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "0.75rem",
                color: "#f97373",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

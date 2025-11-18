"use client";

import Link from "next/link";

const navItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Search", href: "/dashboard/search" },
  { label: "Chats", href: "/dashboard/chat" },
  { label: "Friends", href: "/dashboard/friends" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Settings", href: "/dashboard/settings" }
];

export default function LeftSidebar({ activePath }) {
  return (
    <div className="card" style={{ position: "sticky", top: 84 }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
        Navigation
      </h3>
      <nav style={{ display: "grid", gap: "0.25rem" }}>
        {navItems.map((item) => {
          const active = activePath === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.45rem 0.65rem",
                  borderRadius: 999,
                  backgroundColor: active ? "#0f172a" : "transparent",
                  color: active ? "#e5e7eb" : "#9ca3af",
                  fontSize: "0.9rem",
                  transition: "background 0.1s ease"
                }}
              >
                <span>{item.label}</span>
                {active && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "linear-gradient(135deg,#38bdf8,#a855f7)"
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

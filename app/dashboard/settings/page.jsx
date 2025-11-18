"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("connect4x:user");
    router.push("/");
  };

  return (
    <div className="card" style={{ display: "grid", gap: "1rem" }}>
      <div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Settings</h2>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          Basic account actions for now — extend this later as needed.
        </p>
      </div>
      <div>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            marginBottom: "0.35rem"
          }}
        >
          Account
        </h3>
        <button
          className="btn-ghost"
          style={{ borderColor: "#f97373", color: "#fecaca" }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

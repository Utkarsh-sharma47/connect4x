"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("connect4x:user");
    if (stored) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      localStorage.setItem("connect4x:user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 420 }} className="card">
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: "0.75rem"
        }}
      >
        Log in to Connect4x
      </h2>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#9ca3af",
          marginBottom: "1.1rem"
        }}
      >
        Welcome back! Jump back into your feed and chats.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.8rem" }}
      >
        <div>
          <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Email</label>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Password
          </label>
          <input
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p style={{ fontSize: "0.8rem", color: "#f97373" }}>{error}</p>
        )}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          Demo note: data is stored in MongoDB. Avoid real passwords.
        </p>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Sign up failed");
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
    <div style={{ width: "100%", maxWidth: 460 }} className="card">
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: "0.75rem"
        }}
      >
        Create your Connect4x account
      </h2>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#9ca3af",
          marginBottom: "1.1rem"
        }}
      >
        No verification here — this is a local demo. Use test credentials only.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.8rem" }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.7rem",
            gridTemplateColumns: "1.1fr 0.9fr"
          }}
        >
          <div>
            <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Full name
            </label>
            <input
              className="input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Utkarsh Sharma"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Username
            </label>
            <input
              className="input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="@utkarsh"
            />
          </div>
        </div>
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
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 4 characters (demo)"
          />
        </div>
        {error && (
          <p style={{ fontSize: "0.8rem", color: "#f97373" }}>{error}</p>
        )}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          Users are stored in MongoDB. You can inspect them using MongoDB Atlas or Compass.
        </p>
      </form>
    </div>
  );
}

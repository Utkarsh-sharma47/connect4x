import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: 960,
        width: "100%",
        display: "grid",
        gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)",
        gap: "2.5rem"
      }}
    >
      <section>
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            marginBottom: "1rem"
          }}
        >
          Stay{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#38bdf8,#a855f7)",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}
          >
            connected
          </span>{" "}
          with your circle.
        </h1>
        <p
          style={{
            color: "#9ca3af",
            marginBottom: "1.8rem",
            fontSize: "0.98rem",
            lineHeight: 1.6
          }}
        >
          Connect4x is a clean, Twitter-style space to write quick updates,
          like your friends&apos; posts, discover new people and chat with
          them — all inside one focused dashboard.
        </p>
        <div style={{ display: "flex", gap: "0.9rem", alignItems: "center" }}>
          <Link href="/signup">
            <button className="btn-primary">Join Connect4x</button>
          </Link>
          <Link href="/login">
            <button className="btn-ghost">I already have an account</button>
          </Link>
        </div>
        <div
          style={{
            marginTop: "1.8rem",
            display: "flex",
            gap: "1.2rem",
            alignItems: "center",
            fontSize: "0.8rem",
            color: "#9ca3af"
          }}
        >
          <span className="badge">demo project</span>
          <span>Next.js · MongoDB · Feed · Search · Chat</span>
        </div>
      </section>
      <section className="card" style={{ alignSelf: "center" }}>
        <p
          style={{
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#6b7280",
            marginBottom: "0.4rem"
          }}
        >
          Preview
        </p>
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #111827",
            background: "radial-gradient(circle at top left,#020617,#020617)",
            padding: "0.75rem"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 2fr 1.2fr",
              gap: "0.75rem",
              fontSize: "0.78rem"
            }}
          >
            <div style={{ borderRight: "1px solid #111827", paddingRight: "0.75rem" }}>
              <p style={{ marginBottom: "0.5rem", color: "#9ca3af" }}>Navigation</p>
              <ul style={{ listStyle: "none", display: "grid", gap: "0.35rem" }}>
                {["Home","Search","Chats","Profile","Friends","Settings"].map(item => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: item === "Home" ? "#e5e7eb" : "#6b7280"
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        backgroundColor: item === "Home" ? "#38bdf8" : "#374151"
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ borderRight: "1px solid #111827", paddingRight: "0.75rem" }}>
              <p style={{ marginBottom: "0.5rem", color: "#9ca3af" }}>Feed</p>
              <div style={{ display: "grid", gap: "0.45rem" }}>
                <div
                  style={{
                    padding: "0.35rem 0.45rem",
                    borderRadius: 10,
                    background: "#020617",
                    border: "1px solid #111827"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 2
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.75rem" }}>
                      you
                    </span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#6b7280"
                      }}
                    >
                      just now
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af"
                    }}
                  >
                    &quot;Kicking off my Connect4x build today.&quot;
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.35rem 0.45rem",
                    borderRadius: 10,
                    background: "#020617",
                    border: "1px solid #111827"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 2
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.75rem" }}>
                      friend.dev
                    </span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#6b7280"
                      }}
                    >
                      2m
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af"
                    }}
                  >
                    &quot;Ship first, polish later.&quot;
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p style={{ marginBottom: "0.5rem", color: "#9ca3af" }}>People</p>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                {["utkarsh","devgirl","nextjsfan"].map(name => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem"
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          background: "#020617",
                          border: "1px solid #1f2937"
                        }}
                      />
                      <span>@{name}</span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#4b5563"
                      }}
                    >
                      online
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

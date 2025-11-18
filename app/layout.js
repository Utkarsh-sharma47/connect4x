import "./globals.css";
import ClientHeader from "@/components/ClientHeader";

export const metadata = {
  title: "Connect4x - Social feed",
  description: "Connect4x is a minimal Twitter-style social app built with Next.js and MongoDB."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main-layout">
          <ClientHeader />
          <main className="main-content">{children}</main>
          <footer
            style={{
              textAlign: "center",
              padding: "0.75rem",
              fontSize: "0.75rem",
              color: "#6b7280"
            }}
          >
            Connect4x · Built with Next.js & MongoDB
          </footer>
        </div>
      </body>
    </html>
  );
}

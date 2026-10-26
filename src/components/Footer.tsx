"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const [year, setYear] = React.useState("2026");

  React.useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      backgroundColor: "var(--bg-card)",
      padding: "3.5rem 0 2rem",
      marginTop: "auto"
    }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div>
            <div className="brand" style={{ marginBottom: "0.5rem" }}>
              <div className="brand-dot" />
              <span>Lumina<span style={{ color: "var(--lime-primary)" }}>Blog</span></span>
            </div>
            <p style={{ fontSize: "0.875rem", maxWidth: "380px" }}>
              Modern high-performance publishing platform crafted with Next.js, Lime Green minimalism, and rock-solid full-stack architecture.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link href="/" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Articles
            </Link>
            <Link href="/blogs/create" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Publish
            </Link>
            <a
              href="https://github.com/Sathyajith13-ENG/Full-Stack-Blog-Application"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--lime-primary)",
                fontSize: "0.875rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Sparkles size={14} /> GitHub Repository
            </a>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.825rem",
          color: "var(--text-muted)"
        }}>
          <span>&copy; {year} LuminaBlog Platform. All rights reserved.</span>
          <span>Designed with high contrast Lime &amp; White aesthetics.</span>
        </div>
      </div>
    </footer>
  );
}

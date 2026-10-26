"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useConfirm } from "@/context/ConfirmContext";
import { PenSquare, LogIn, UserPlus, LogOut, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, loading, logout, sidebarOpen, toggleSidebar } = useAuth();
  const { confirm } = useConfirm();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Sign Out",
      message: "Are you sure you want to log out of your account?",
      confirmText: "Yes, Sign Out",
      cancelText: "No, Stay Signed In",
      variant: "danger",
    });
    if (ok) {
      await logout();
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link href="/" className="brand">
          <div className="brand-dot" />
          <span>Lumina<span style={{ color: "var(--lime-primary)" }}>Blog</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }} className="desktop-nav">
          <Link href="/" className="btn btn-outline btn-sm">
            Explore
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/blogs/create" className="btn btn-lime btn-sm">
                    <PenSquare size={16} />
                    Write Article
                  </Link>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "0.5rem" }}>
                    <button
                      onClick={toggleSidebar}
                      className="btn btn-outline btn-sm"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.35rem 0.85rem",
                        background: sidebarOpen ? "var(--lime-subtle)" : "var(--bg-card)",
                        borderColor: sidebarOpen ? "var(--lime-primary)" : "var(--border)"
                      }}
                      title="Account & Status Settings"
                    >
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "var(--lime-primary)",
                        boxShadow: "0 0 6px var(--lime-primary)"
                      }} />
                      <span style={{ fontWeight: 600, color: "#fff" }}>{user.name}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="btn btn-outline btn-sm"
                      title="Log Out"
                      style={{ padding: "0.4rem 0.65rem" }}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Link href="/login" className="btn btn-outline btn-sm">
                    <LogIn size={15} />
                    Sign In
                  </Link>
                  <Link href="/register" className="btn btn-lime btn-sm">
                    <UserPlus size={15} />
                    Get Started
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle btn btn-outline btn-sm"
          style={{ display: "none" }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: "1rem 1.5rem 1.5rem",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem"
        }}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline">
            Explore
          </Link>
          {user ? (
            <>
              <Link href="/blogs/create" onClick={() => setMobileMenuOpen(false)} className="btn btn-lime">
                <PenSquare size={16} />
                Write Article
              </Link>
              <div style={{ padding: "0.5rem 0", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                Signed in as <strong style={{ color: "#fff" }}>{user.name}</strong>
              </div>
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-danger">
                <LogOut size={16} /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline">
                <LogIn size={16} /> Sign In
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-lime">
                <Sparkles size={16} /> Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

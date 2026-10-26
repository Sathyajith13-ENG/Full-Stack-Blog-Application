"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  User,
  Mail,
  Calendar,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Save,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Activity
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  totalArticles: number;
  articles: Array<{
    id: string;
    title: string;
    category?: string;
    createdAt: string;
  }>;
}

export default function AccountSidebar() {
  const { user, sidebarOpen, setSidebarOpen, logout, updateUserState } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"status" | "articles" | "settings">("status");

  useEffect(() => {
    if (sidebarOpen && user) {
      fetchProfile();
    }
  }, [sidebarOpen, user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const json = await res.json();
        setProfile(json.profile);
        setName(json.profile.name);
        setBio(json.profile.bio || "");
        setAvatarUrl(json.profile.avatarUrl || "");
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatarUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        updateUserState({ name: data.user.name });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 99,
          animation: "fadeIn 0.2s ease"
        }}
      />

      {/* Slide-out Sidebar Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--bg-card)",
          borderRight: "1px solid var(--border)",
          boxShadow: "10px 0 35px rgba(0, 0, 0, 0.8)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10, 12, 11, 0.8)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 2
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "var(--lime-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--lime-primary)",
              border: "1px solid rgba(132, 204, 22, 0.3)"
            }}>
              <ShieldCheck size={16} />
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Account &amp; Status</h2>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-outline btn-sm"
            style={{ padding: "0.4rem 0.6rem" }}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          padding: "0.5rem 1rem",
          gap: "0.5rem",
          background: "var(--bg-dark)"
        }}>
          <button
            onClick={() => setActiveTab("status")}
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "0.825rem",
              fontWeight: 600,
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              background: activeTab === "status" ? "var(--lime-primary)" : "transparent",
              color: activeTab === "status" ? "var(--text-on-lime)" : "var(--text-secondary)"
            }}
          >
            <Activity size={14} /> Status
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "0.825rem",
              fontWeight: 600,
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              background: activeTab === "articles" ? "var(--lime-primary)" : "transparent",
              color: activeTab === "articles" ? "var(--text-on-lime)" : "var(--text-secondary)"
            }}
          >
            <Layers size={14} /> My Articles ({profile?.totalArticles ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "0.825rem",
              fontWeight: 600,
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              background: activeTab === "settings" ? "var(--lime-primary)" : "transparent",
              color: activeTab === "settings" ? "var(--text-on-lime)" : "var(--text-secondary)"
            }}
          >
            <Settings size={14} /> Settings
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "1.5rem", flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
              Loading account information...
            </div>
          ) : !user ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
                You are currently browsing as a Guest. Sign in to view account status and settings.
              </p>
              <Link
                href="/login"
                onClick={() => setSidebarOpen(false)}
                className="btn btn-lime"
                style={{ width: "100%", marginBottom: "0.75rem" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setSidebarOpen(false)}
                className="btn btn-outline"
                style={{ width: "100%" }}
              >
                Create Account
              </Link>
            </div>
          ) : (
            <>
              {/* TAB 1: Account Status */}
              {activeTab === "status" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* User Profile Card */}
                  <div style={{
                    padding: "1.25rem",
                    background: "var(--bg-input)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={name}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid var(--lime-primary)"
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "var(--lime-subtle)",
                        border: "2px solid var(--lime-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--lime-primary)",
                        fontSize: "1.35rem",
                        fontWeight: 700
                      }}>
                        {name ? name.charAt(0).toUpperCase() : <User size={24} />}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{name}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.email}</div>
                      <span className="badge-lime" style={{ marginTop: "0.4rem" }}>
                        <Sparkles size={11} style={{ marginRight: "0.3rem" }} /> Verified Author
                      </span>
                    </div>
                  </div>

                  {/* Account Metrics Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{
                      padding: "1rem",
                      background: "var(--bg-input)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--lime-primary)" }}>
                        {profile?.totalArticles ?? 0}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                        Articles Published
                      </div>
                    </div>

                    <div style={{
                      padding: "1rem",
                      background: "var(--bg-input)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff" }}>
                        Active
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                        Account Status
                      </div>
                    </div>
                  </div>

                  {/* Account Details list */}
                  <div style={{
                    padding: "1rem",
                    background: "var(--bg-input)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    fontSize: "0.85rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <User size={14} /> Author ID
                      </span>
                      <code style={{ color: "var(--lime-light)", fontSize: "0.75rem" }}>{user.userId}</code>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Mail size={14} /> Email
                      </span>
                      <span style={{ color: "#fff" }}>{user.email}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Calendar size={14} /> Joined
                      </span>
                      <span style={{ color: "#fff" }}>
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "Member"}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <ShieldCheck size={14} /> Permissions
                      </span>
                      <span style={{ color: "var(--lime-primary)", fontWeight: 600 }}>Create, Edit &amp; Delete</span>
                    </div>
                  </div>

                  {/* Bio statement */}
                  {profile?.bio && (
                    <div style={{
                      padding: "1rem",
                      background: "var(--bg-input)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)"
                    }}>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                        Bio &amp; Mission
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "#e2e8f0", lineHeight: 1.5 }}>
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  <div style={{ marginTop: "0.5rem" }}>
                    <Link
                      href="/blogs/create"
                      onClick={() => setSidebarOpen(false)}
                      className="btn btn-lime"
                      style={{ width: "100%", padding: "0.75rem" }}
                    >
                      <Sparkles size={16} /> Publish New Article
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 2: My Articles List */}
              {activeTab === "articles" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      Articles authored by you
                    </span>
                    <Link
                      href="/blogs/create"
                      onClick={() => setSidebarOpen(false)}
                      className="btn btn-lime btn-sm"
                    >
                      + Write
                    </Link>
                  </div>

                  {profile?.articles && profile.articles.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {profile.articles.map((art) => (
                        <div
                          key={art.id}
                          style={{
                            padding: "0.85rem 1rem",
                            background: "var(--bg-input)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border)",
                            transition: "all 0.2s"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                            <Link
                              href={`/blogs/${art.id}`}
                              onClick={() => setSidebarOpen(false)}
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: "#fff",
                                lineHeight: 1.35
                              }}
                            >
                              {art.title}
                            </Link>
                          </div>

                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "0.6rem",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)"
                          }}>
                            <span className="badge-lime" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                              {art.category || "General"}
                            </span>

                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <Link
                                href={`/blogs/${art.id}/edit`}
                                onClick={() => setSidebarOpen(false)}
                                style={{ color: "var(--lime-primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.2rem" }}
                              >
                                Edit
                              </Link>
                              <span>•</span>
                              <Link
                                href={`/blogs/${art.id}`}
                                onClick={() => setSidebarOpen(false)}
                                style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.2rem" }}
                              >
                                View <ExternalLink size={11} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: "center",
                      padding: "2.5rem 1rem",
                      background: "var(--bg-input)",
                      borderRadius: "var(--radius-md)",
                      border: "1px dashed var(--border)"
                    }}>
                      <FileText size={28} style={{ color: "var(--text-muted)", margin: "0 auto 0.75rem" }} />
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                        You haven&apos;t written any articles yet.
                      </p>
                      <Link
                        href="/blogs/create"
                        onClick={() => setSidebarOpen(false)}
                        className="btn btn-lime btn-sm"
                      >
                        Create Your First Article
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Settings & Edit Profile */}
              {activeTab === "settings" && (
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {saveSuccess && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "rgba(34, 197, 94, 0.15)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      color: "#86efac",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.85rem"
                    }}>
                      <CheckCircle size={16} /> Profile settings updated successfully!
                    </div>
                  )}

                  <div className="input-group" style={{ marginBottom: "0.5rem" }}>
                    <label className="input-label" htmlFor="sidebar-name">Display Name</label>
                    <input
                      id="sidebar-name"
                      type="text"
                      required
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: "0.5rem" }}>
                    <label className="input-label" htmlFor="sidebar-avatar">Avatar Image URL (Optional)</label>
                    <input
                      id="sidebar-avatar"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="input-field"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: "0.5rem" }}>
                    <label className="input-label" htmlFor="sidebar-bio">Bio / Tagline</label>
                    <textarea
                      id="sidebar-bio"
                      className="textarea-field"
                      style={{ minHeight: "90px" }}
                      placeholder="Tell readers a few words about your background..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-lime"
                    style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}
                  >
                    {saving ? "Saving..." : "Save Settings"}
                    {!saving && <Save size={16} />}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer with logout */}
        {user && (
          <div style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-card)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="btn btn-danger btn-sm"
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <LogOut size={15} /> Sign Out of Account
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

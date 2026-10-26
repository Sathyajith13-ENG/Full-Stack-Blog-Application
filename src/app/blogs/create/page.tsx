"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, AlertCircle } from "lucide-react";

const CATEGORIES = ["Architecture", "Design", "Performance", "Technology", "General"];

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Architecture");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/blogs/create");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    }

    if (content.trim().length < 10) {
      setError("Article content must be at least 10 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          summary,
          imageUrl,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish article.");
      }

      router.push(`/blogs/${data.data.id}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container" style={{ padding: "5rem 0", textAlign: "center" }}>
        <p>Loading editor...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 6rem", maxWidth: "860px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            marginBottom: "1rem"
          }}
        >
          <ArrowLeft size={16} /> Back to Articles
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge-lime"><Sparkles size={12} /> New Publication</span>
        </div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800 }}>Draft New Article</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Express your ideas with high clarity. Formatting with markdown headings and lists is supported.
        </p>
      </div>

      {error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#fca5a5",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          marginBottom: "1.5rem"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: "2.5rem" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="title">Article Title *</label>
          <input
            id="title"
            type="text"
            required
            className="input-field"
            placeholder="e.g. Next-Generation Full-Stack Web Development Patterns"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="input-group">
            <label className="input-label" htmlFor="category">Category</label>
            <select
              id="category"
              className="select-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: "var(--bg-card)", color: "#fff" }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="summary">Short Summary (Optional)</label>
            <input
              id="summary"
              type="text"
              className="input-field"
              placeholder="A brief 1-2 sentence preview"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="imageUrl">Cover Image URL (Optional)</label>
          <input
            id="imageUrl"
            type="url"
            className="input-field"
            placeholder="e.g. https://images.unsplash.com/photo-1555066931-4365d14bab8c"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl && (
            <div style={{ marginTop: "0.5rem", borderRadius: "var(--radius-md)", overflow: "hidden", maxHeight: "180px", border: "1px solid var(--border)" }}>
              <img
                src={imageUrl}
                alt="Article cover preview"
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="content">Content *</label>
          <textarea
            id="content"
            required
            className="textarea-field"
            style={{ minHeight: "280px" }}
            placeholder="Write your article markdown or plain text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <Link href="/" className="btn btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-lime"
            style={{ padding: "0.75rem 1.75rem" }}
          >
            {submitting ? "Publishing..." : "Publish Article"}
            {!submitting && <Send size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}

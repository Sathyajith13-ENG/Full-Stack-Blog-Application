"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useConfirm } from "@/context/ConfirmContext";
import { Blog } from "@/types";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { clientBlogStorage } from "@/lib/clientStorage";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Architecture", "Design", "Performance", "Technology", "General"];

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { confirm } = useConfirm();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Architecture");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        let b: Blog | null = null;
        const res = await fetch(`/api/blogs/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          b = data.data;
          if (b) clientBlogStorage.saveBlog(b);
        } else {
          // Fallback to client storage
          b = clientBlogStorage.getBlogById(resolvedParams.id);
        }

        if (!b) {
          throw new Error("Could not find article.");
        }

        // Authorization check: User must be author
        if (user && b.authorId !== user.userId) {
          setError("Forbidden: You do not have permission to edit this article.");
          return;
        }

        setTitle(b.title);
        setCategory(b.category || "General");
        setSummary(b.summary || "");
        setImageUrl(b.imageUrl || "");
        setContent(b.content);
      } catch (err: unknown) {
        const local = clientBlogStorage.getBlogById(resolvedParams.id);
        if (local) {
          if (user && local.authorId !== user.userId) {
            setError("Forbidden: You do not have permission to edit this article.");
            return;
          }
          setTitle(local.title);
          setCategory(local.category || "General");
          setSummary(local.summary || "");
          setImageUrl(local.imageUrl || "");
          setContent(local.content);
        } else {
          const msg = err instanceof Error ? err.message : "Failed to load blog";
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchBlog();
      }
    }
  }, [resolvedParams.id, user, authLoading, router]);

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

    const ok = await confirm({
      title: "Save Changes",
      message: "Are you sure you want to save the updates made to this article?",
      confirmText: "Yes, Save Changes",
      cancelText: "No, Keep Editing",
      variant: "lime",
    });

    if (!ok) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/blogs/${resolvedParams.id}`, {
        method: "PUT",
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
        throw new Error(data.error || "Failed to update article.");
      }

      if (data.data) {
        clientBlogStorage.saveBlog(data.data);
      }

      router.push(`/blogs/${resolvedParams.id}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container" style={{ padding: "5rem 0", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 6rem", maxWidth: "860px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href={`/blogs/${resolvedParams.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            marginBottom: "1rem"
          }}
        >
          <ArrowLeft size={16} /> Back to Article
        </Link>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800 }}>Edit Article</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Update your thoughts and keep your readers informed with the latest insights.
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
            <label className="input-label" htmlFor="summary">Short Summary</label>
            <input
              id="summary"
              type="text"
              className="input-field"
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <Link href={`/blogs/${resolvedParams.id}`} className="btn btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-lime"
            style={{ padding: "0.75rem 1.75rem" }}
          >
            {submitting ? "Saving changes..." : "Save Changes"}
            {!submitting && <Save size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}

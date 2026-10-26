"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useConfirm } from "@/context/ConfirmContext";
import { Blog } from "@/types";
import { ArrowLeft, Clock, Calendar, User, Edit3, Trash2, Share2, Check, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { confirm } = useConfirm();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error("Article not found.");
        }
        const data = await res.json();
        setBlog(data.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load article";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete Article",
      message: `Are you sure you want to permanently delete "${blog?.title || "this article"}"? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      cancelText: "No, Keep Article",
      variant: "danger",
    });

    if (!ok) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete article.");
      }

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting blog");
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center", maxWidth: "500px" }}>
        <h2 style={{ marginBottom: "1rem" }}>Article Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          The article you are looking for does not exist or has been removed.
        </p>
        <Link href="/" className="btn btn-lime">
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    );
  }

  const isOwner = user && user.userId === blog.authorId;

  return (
    <article className="container" style={{ padding: "3rem 1.5rem 7rem", maxWidth: "820px" }}>
      {/* Top action row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            fontSize: "0.875rem"
          }}
        >
          <ArrowLeft size={16} /> Back to all articles
        </Link>

        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <button
            onClick={handleShare}
            className="btn btn-outline btn-sm"
            title="Copy link"
          >
            {copied ? <Check size={14} style={{ color: "var(--lime-primary)" }} /> : <Share2 size={14} />}
            {copied ? "Link Copied!" : "Share"}
          </button>

          {/* Edit/Delete permissions: strictly visible and permitted for the owner */}
          {isOwner && (
            <>
              <Link href={`/blogs/${blog.id}/edit`} className="btn btn-outline btn-sm">
                <Edit3 size={14} /> Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Article Header */}
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "1.25rem" }}>
          <span className="badge-lime">{blog.category || "General"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <Clock size={14} />
            <span>{blog.readTime || "3 min read"}</span>
          </div>
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: "1.5rem"
        }}>
          {blog.title}
        </h1>

        {blog.summary && (
          <p style={{
            fontSize: "1.2rem",
            lineHeight: 1.6,
            color: "var(--lime-light)",
            opacity: 0.9,
            marginBottom: "1.75rem",
            borderLeft: "3px solid var(--lime-primary)",
            paddingLeft: "1.25rem"
          }}>
            {blog.summary}
          </p>
        )}

        {/* Author Bio Box */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)"
        }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "var(--lime-subtle)",
            border: "1px solid rgba(132, 204, 22, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--lime-primary)",
            fontSize: "1rem",
            fontWeight: 700
          }}>
            {blog.authorName ? blog.authorName.charAt(0).toUpperCase() : <User size={18} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>
              {blog.authorName}
            </div>
            <div style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              {blog.authorEmail}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.825rem", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "flex-end" }}>
              <Calendar size={13} />
              Published: {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            {blog.updatedAt !== blog.createdAt && (
              <div style={{ fontSize: "0.75rem", color: "var(--lime-primary)", marginTop: "0.15rem" }}>
                Updated: {new Date(blog.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            )}
          </div>
        </div>
        {/* Cover Image */}
        {blog.imageUrl && (
          <div style={{
            marginTop: "1.75rem",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            maxHeight: "440px"
          }}>
            <img
              src={blog.imageUrl}
              alt={blog.title}
              style={{
                width: "100%",
                maxHeight: "440px",
                objectFit: "cover",
                display: "block"
              }}
            />
          </div>
        )}
      </header>

      {/* Main Body */}
      <section style={{
        fontSize: "1.1rem",
        lineHeight: 1.8,
        color: "#d1d5db",
        whiteSpace: "pre-line",
        borderTop: "1px solid var(--border)",
        paddingTop: "2.5rem"
      }}>
        {blog.content}
      </section>

      {/* Owner controls bottom banner if logged in as owner */}
      {isOwner && (
        <div style={{
          marginTop: "4rem",
          padding: "1.5rem",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-md)",
          border: "1px dashed rgba(132, 204, 22, 0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <strong style={{ color: "#fff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles size={16} style={{ color: "var(--lime-primary)" }} /> You are the author of this post
            </strong>
            <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
              Only you have administrative privileges to edit or delete this article.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href={`/blogs/${blog.id}/edit`} className="btn btn-outline btn-sm">
              <Edit3 size={14} /> Edit Story
            </Link>
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

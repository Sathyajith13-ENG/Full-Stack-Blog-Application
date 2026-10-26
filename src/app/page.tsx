"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Blog } from "@/types";
import { Search, ArrowRight, Clock, User, Calendar, BookOpen, Sparkles, Filter } from "lucide-react";

const CATEGORIES = ["All", "Architecture", "Design", "Performance", "Technology", "General"];

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const fetchBlogs = async (q = searchQuery, cat = selectedCategory) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.append("q", q.trim());
      if (cat && cat !== "All") params.append("category", cat);

      const res = await fetch(`/api/blogs?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setBlogs(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      fetchBlogs(searchQuery, selectedCategory);
    });
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    fetchBlogs(searchQuery, cat);
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Background ambient light */}
      <div className="hero-glow" />

      {/* Hero Header */}
      <section style={{ padding: "5rem 0 3.5rem", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: "840px" }}>
          <div style={{ display: "inline-flex", marginBottom: "1.25rem" }}>
            <span className="badge-lime" style={{ display: "inline-flex", gap: "0.4rem" }}>
              <Sparkles size={13} /> The Modern Publishing Experience
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, marginBottom: "1.25rem", lineHeight: 1.15 }}>
            Ideas, perspectives, and <br />
            <span style={{ color: "var(--lime-primary)" }}>engineering craft</span> in harmony.
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: "620px", margin: "0 auto 2.5rem" }}>
            A curated space for developers, designers, and creators to share deep insights with focused typography and high-contrast aesthetics.
          </p>

          {/* Search bar & filter */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              gap: "0.75rem",
              maxWidth: "600px",
              margin: "0 auto",
              background: "var(--bg-card)",
              padding: "0.5rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", paddingLeft: "0.75rem", color: "var(--text-muted)" }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search articles by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "0.95rem"
              }}
            />
            <button type="submit" className="btn btn-lime btn-sm" style={{ padding: "0.6rem 1.25rem" }}>
              Search
            </button>
          </form>

          {/* Categories */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-muted)", fontSize: "0.85rem", marginRight: "0.5rem" }}>
              <Filter size={14} /> Filter:
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  background: selectedCategory === cat ? "var(--lime-primary)" : "var(--bg-card)",
                  color: selectedCategory === cat ? "var(--text-on-lime)" : "var(--text-secondary)",
                  border: selectedCategory === cat ? "1px solid var(--lime-primary)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-full)",
                  padding: "0.35rem 0.95rem",
                  fontSize: "0.825rem",
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section style={{ padding: "2rem 0 6rem" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div>
              <h2 style={{ fontSize: "1.65rem", fontWeight: 700 }}>Featured Articles</h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Showing {blogs.length} {blogs.length === 1 ? "article" : "articles"}
              </p>
            </div>

            <Link href="/blogs/create" className="btn btn-outline btn-sm">
              Publish Story <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card" style={{ height: "260px", opacity: 0.5, animation: "pulse 1.5s infinite" }}>
                  <div style={{ height: "20px", background: "var(--border)", borderRadius: "4px", width: "30%", marginBottom: "1rem" }} />
                  <div style={{ height: "30px", background: "var(--border)", borderRadius: "4px", width: "90%", marginBottom: "1rem" }} />
                  <div style={{ height: "60px", background: "var(--border)", borderRadius: "4px", width: "100%" }} />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--lime-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--lime-primary)"
              }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: "1.3rem" }}>No articles found</h3>
              <p style={{ maxWidth: "420px", margin: "0 auto" }}>
                {searchQuery || selectedCategory !== "All"
                  ? "We couldn't find any articles matching your search query or filter. Try a different search."
                  : "Be the very first author to publish an insight to LuminaBlog!"}
              </p>
              <Link href="/blogs/create" className="btn btn-lime" style={{ marginTop: "0.5rem" }}>
                Create First Article
              </Link>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.75rem"
            }}>
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="card card-hover"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%"
                  }}
                >
                  <div>
                    {/* Header: Category & Read Time */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
                      <span className="badge-lime">{blog.category || "General"}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        <Clock size={13} />
                        <span>{blog.readTime || "3 min read"}</span>
                      </div>
                    </div>

                    {/* Optional Cover Image */}
                    {blog.imageUrl && (
                      <Link href={`/blogs/${blog.id}`} style={{ display: "block", marginBottom: "1.1rem" }}>
                        <div style={{
                          height: "180px",
                          width: "100%",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                          border: "1px solid var(--border)"
                        }}>
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                        </div>
                      </Link>
                    )}

                    {/* Title */}
                    <Link href={`/blogs/${blog.id}`}>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          marginBottom: "0.75rem",
                          lineHeight: 1.35,
                          transition: "color 0.2s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--lime-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                      >
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Summary */}
                    <p style={{
                      fontSize: "0.925rem",
                      marginBottom: "1.5rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {blog.summary || blog.content.slice(0, 140) + "..."}
                    </p>
                  </div>

                  {/* Footer: Author & Date */}
                  <div style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: "var(--lime-subtle)",
                        border: "1px solid rgba(132, 204, 22, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--lime-primary)",
                        fontSize: "0.75rem",
                        fontWeight: 700
                      }}>
                        {blog.authorName ? blog.authorName.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
                          {blog.authorName}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Calendar size={11} />
                          {new Date(blog.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/blogs/${blog.id}`}
                      style={{
                        color: "var(--lime-primary)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}
                    >
                      Read <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

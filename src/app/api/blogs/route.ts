import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/blogs - List blogs (Supports search, category filtering, and author filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();
    const category = searchParams.get("category");
    const authorId = searchParams.get("authorId");

    let blogs = db.getBlogs();

    if (query) {
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.content.toLowerCase().includes(query) ||
          b.authorName.toLowerCase().includes(query)
      );
    }

    if (category && category !== "All") {
      blogs = blogs.filter((b) => b.category?.toLowerCase() === category.toLowerCase());
    }

    if (authorId) {
      blogs = blogs.filter((b) => b.authorId === authorId);
    }

    return NextResponse.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog (Requires Authentication)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to publish articles." },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, summary } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Title is required and must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Content is required and must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // Estimate reading time: ~200 words per minute
    const wordsCount = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordsCount / 200));
    const calculatedReadTime = `${minutes} min read`;

    const now = new Date().toISOString();
    const newBlog = {
      id: "blog-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      content: content.trim(),
      summary: summary?.trim() || title.trim().slice(0, 150) + "...",
      category: category?.trim() || "General",
      readTime: calculatedReadTime,
      authorId: user.userId,
      authorName: user.name,
      authorEmail: user.email,
      createdAt: now,
      updatedAt: now,
    };

    const savedBlog = db.createBlog(newBlog);

    return NextResponse.json(
      {
        success: true,
        message: "Blog article published successfully!",
        data: savedBlog,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

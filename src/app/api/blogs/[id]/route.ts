import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/blogs/[id] - Get a single blog by ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const blog = db.getBlogById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/blogs/[id] - Update blog (Only owner can update)
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to update this blog." },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid session token." },
        { status: 401 }
      );
    }

    const existingBlog = db.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    // Authorization check: user can edit only their own blogs
    if (existingBlog.authorId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden. You can only edit your own blogs." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, category, summary, imageUrl } = body;

    const updates: Record<string, string> = {};
    if (title && typeof title === "string" && title.trim().length >= 3) {
      updates.title = title.trim();
    }
    if (content && typeof content === "string" && content.trim().length >= 10) {
      updates.content = content.trim();
      const wordsCount = updates.content.split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordsCount / 200));
      updates.readTime = `${minutes} min read`;
    }
    if (category && typeof category === "string") {
      updates.category = category.trim();
    }
    if (summary !== undefined) {
      updates.summary = summary ? summary.trim() : (updates.title || existingBlog.title).slice(0, 150) + "...";
    }
    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl.trim();
    }

    const updated = db.updateBlog(id, updates);

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully!",
      data: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/blogs/[id] - Delete blog (Only owner can delete)
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to delete this blog." },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid session token." },
        { status: 401 }
      );
    }

    const existingBlog = db.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    // Authorization check: user can delete only their own blogs
    if (existingBlog.authorId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own blogs." },
        { status: 403 }
      );
    }

    const deleted = db.deleteBlog(id);
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete blog." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully!",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

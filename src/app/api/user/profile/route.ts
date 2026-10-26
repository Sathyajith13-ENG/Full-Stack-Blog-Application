import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/user/profile - Fetch user details + authored blogs count
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = db.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allBlogs = db.getBlogs();
    const userBlogs = allBlogs.filter((b) => b.authorId === user.id);

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio || "Passionate writer and technology explorer.",
        avatarUrl: user.avatarUrl || "",
        createdAt: user.createdAt,
        totalArticles: userBlogs.length,
        articles: userBlogs.map((b) => ({
          id: b.id,
          title: b.title,
          category: b.category,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        })),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/user/profile - Update user profile bio / avatar
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, avatarUrl } = body;

    const updates: Record<string, string> = {};
    if (name && typeof name === "string" && name.trim().length >= 2) {
      updates.name = name.trim();
    }
    if (bio !== undefined && typeof bio === "string") {
      updates.bio = bio.trim();
    }
    if (avatarUrl !== undefined && typeof avatarUrl === "string") {
      updates.avatarUrl = avatarUrl.trim();
    }

    const updated = db.updateUser(payload.userId, updates);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

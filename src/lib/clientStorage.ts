import { Blog } from "@/types";

const LOCAL_STORAGE_KEY = "lumina_custom_blogs";

export const clientBlogStorage = {
  getBlogs: (): Blog[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getBlogById: (id: string): Blog | null => {
    if (typeof window === "undefined") return null;
    const blogs = clientBlogStorage.getBlogs();
    return blogs.find((b) => b.id === id) || null;
  },

  saveBlog: (blog: Blog): void => {
    if (typeof window === "undefined") return;
    try {
      const blogs = clientBlogStorage.getBlogs();
      const existingIdx = blogs.findIndex((b) => b.id === blog.id);
      if (existingIdx >= 0) {
        blogs[existingIdx] = blog;
      } else {
        blogs.unshift(blog);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogs));
    } catch {
      // storage quota or disabled
    }
  },

  removeBlog: (id: string): void => {
    if (typeof window === "undefined") return;
    try {
      const blogs = clientBlogStorage.getBlogs().filter((b) => b.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogs));
    } catch {
      // storage quota or disabled
    }
  },

  mergeWithServerBlogs: (serverBlogs: Blog[]): Blog[] => {
    if (typeof window === "undefined") return serverBlogs;
    const clientBlogs = clientBlogStorage.getBlogs();
    if (!clientBlogs || clientBlogs.length === 0) return serverBlogs;

    const map = new Map<string, Blog>();
    // Add server blogs
    serverBlogs.forEach((b) => map.set(b.id, b));
    // Add client blogs (client blogs override server blogs if updated, or add new ones)
    clientBlogs.forEach((b) => map.set(b.id, b));

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};

import fs from "fs";
import path from "path";
import { User, Blog } from "@/types";

interface StorageData {
  users: User[];
  blogs: Blog[];
}

// Initial starter demo data to provide an immediately rich experience
const initialUsers: User[] = [
  {
    id: "user-demo-1",
    name: "Alex Rivera",
    email: "alex@example.com",
    // bcrypt hash for "Password@123"
    passwordHash: "$2a$10$wT5f2rN9eKzW4j9wKjJ3iO9l7E542/gB6Q7u88N9m5o8i8t5sY7Gy",
    createdAt: new Date("2026-01-15T10:00:00Z").toISOString(),
  },
  {
    id: "user-demo-2",
    name: "Elena Vance",
    email: "elena@example.com",
    passwordHash: "$2a$10$wT5f2rN9eKzW4j9wKjJ3iO9l7E542/gB6Q7u88N9m5o8i8t5sY7Gy",
    createdAt: new Date("2026-02-01T12:00:00Z").toISOString(),
  }
];

const initialBlogs: Blog[] = [
  {
    id: "blog-1",
    title: "Mastering Clean Architecture in Modern Web Applications",
    content: "Clean architecture separates software into layers with distinct responsibilities. By isolating domain logic, entities, and presentation layers, your code stays testable, maintainable, and resilient against framework churn.\n\n### The Core Pillars\n1. Independent of Frameworks: Your business logic does not know what UI framework or database you run.\n2. Testable: Business rules can be validated without the UI, Database, or Web Server.\n3. Independent of UI: The frontend can switch without rewriting domain workflows.\n\nApplying these patterns elevates software reliability and makes developer onboarding effortless.",
    summary: "Discover how separating concerns and adhering to clean architecture makes your apps testable, decoupled, and future-proof.",
    category: "Architecture",
    readTime: "4 min read",
    authorId: "user-demo-1",
    authorName: "Alex Rivera",
    authorEmail: "alex@example.com",
    createdAt: new Date("2026-02-10T14:30:00Z").toISOString(),
    updatedAt: new Date("2026-02-10T14:30:00Z").toISOString(),
  },
  {
    id: "blog-2",
    title: "Minimalist Lime & White UI: The Power of High-Contrast Design",
    content: "Minimalism is not the lack of something. It's simply the perfect amount of everything. When pairing electric lime (#84cc16 / #a3e635) with crisp clean white and obsidian dark surfaces, the visual rhythm commands attention without overwhelming cognitive load.\n\n### Why High Accent Works\n- Accent highlights direct focus directly to primary calls-to-action.\n- Crisp typography enhances content legibility.\n- Strategic negative space breathes elegance into every layout.\n\nDesign is as much about what you leave out as what you put in.",
    summary: "Explore the art of minimalist aesthetics, typography hierarchy, and deliberate accent colors in UI/UX engineering.",
    category: "Design",
    readTime: "3 min read",
    authorId: "user-demo-2",
    authorName: "Elena Vance",
    authorEmail: "elena@example.com",
    createdAt: new Date("2026-02-18T09:15:00Z").toISOString(),
    updatedAt: new Date("2026-02-18T09:15:00Z").toISOString(),
  },
  {
    id: "blog-3",
    title: "Full-Stack Performance at Scale: Server Actions and Edge APIs",
    content: "Modern server-side rendering combined with Edge-compatible micro-handlers allows web applications to hit sub-100ms response times anywhere across the globe.\n\nThrough intelligent caching, lean JSON serialization, and stateless token authentication, developers can deliver world-class full-stack experiences without heavyweight infrastructure overhead.",
    summary: "Techniques for achieving lightning fast latency, optimized database queries, and frictionless state handling.",
    category: "Performance",
    readTime: "5 min read",
    authorId: "user-demo-1",
    authorName: "Alex Rivera",
    authorEmail: "alex@example.com",
    createdAt: new Date("2026-02-25T11:20:00Z").toISOString(),
    updatedAt: new Date("2026-02-25T11:20:00Z").toISOString(),
  }
];

// Fallback in-memory singleton for serverless runtimes where disk may be read-only or ephemeral
const memoryStore: StorageData = {
  users: [...initialUsers],
  blogs: [...initialBlogs],
};

const DATA_FILE = path.join(process.cwd(), "data", "storage.json");

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Ignore if read-only filesystem
    }
  }
}

function loadData(): StorageData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // Return memory store if disk access fails
  }
  return memoryStore;
}

function saveData(data: StorageData) {
  memoryStore.users = data.users;
  memoryStore.blogs = data.blogs;

  try {
    ensureDirectoryExists(DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // If running in readonly environment like Vercel edge/lambda without write permissions,
    // in-memory store keeps it functioning seamlessly during runtime.
  }
}

// User CRUD methods
export const db = {
  getUsers: (): User[] => {
    return loadData().users;
  },
  getUserByEmail: (email: string): User | undefined => {
    const users = loadData().users;
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: (id: string): User | undefined => {
    const users = loadData().users;
    return users.find((u) => u.id === id);
  },
  createUser: (user: User): User => {
    const data = loadData();
    data.users.push(user);
    saveData(data);
    return user;
  },

  // Blog CRUD methods
  getBlogs: (): Blog[] => {
    const data = loadData();
    // Return sorted newest first
    return [...data.blogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  getBlogById: (id: string): Blog | undefined => {
    const data = loadData();
    return data.blogs.find((b) => b.id === id);
  },
  createBlog: (blog: Blog): Blog => {
    const data = loadData();
    data.blogs.push(blog);
    saveData(data);
    return blog;
  },
  updateBlog: (id: string, updates: Partial<Blog>): Blog | null => {
    const data = loadData();
    const index = data.blogs.findIndex((b) => b.id === id);
    if (index === -1) return null;

    data.blogs[index] = {
      ...data.blogs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveData(data);
    return data.blogs[index];
  },
  deleteBlog: (id: string): boolean => {
    const data = loadData();
    const initialLen = data.blogs.length;
    data.blogs = data.blogs.filter((b) => b.id !== id);
    if (data.blogs.length !== initialLen) {
      saveData(data);
      return true;
    }
    return false;
  },
};

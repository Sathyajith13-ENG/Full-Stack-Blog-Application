export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  imageUrl?: string;
  readTime?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}


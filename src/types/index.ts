export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  readTime?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

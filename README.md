# 🌿 LuminaBlog — Full-Stack Blog Platform

A modern, high-performance **Full-Stack Blog Application** crafted with **Next.js (App Router)**, **TypeScript**, **JWT Authentication**, and a high-contrast **Lime Green & Crisp White** design aesthetic.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-84cc16?style=for-the-badge)

---

## 🚀 Key Highlights & Features

- **High-Aesthetic UI/UX**: Designed around a sleek dark canvas (`#0a0c0b`), vibrant electric lime green (`#84cc16`), and clean white typography. Avoids color clutter while maximizing readability and visual impact.
- **Full Authentication & Authorization**:
  - Secure User Registration & Login with `bcryptjs` password hashing.
  - Stateless Edge-compatible JWT tokens stored in HTTP-Only cookies.
  - Strict Authorization: Users can create, view, edit, and delete blogs, but **only edit or delete their own blogs**.
- **Complete Blog Management (CRUD)**:
  - **Create**: Rich article drafting with category tagging and real-time word-count reading-time calculation.
  - **Read**: Dynamic article viewer with author metadata, creation date, and last updated timestamps.
  - **Update**: Edit existing articles (strictly reserved for the verified author).
  - **Delete**: Instant deletion with confirmation dialog (strictly reserved for the verified author).
- **Search & Filtering**: Search blogs in real-time by title, author name, or keywords, plus category pills (Architecture, Design, Performance, Technology, etc.).
- **Zero-Setup Data Persistence**: Equipped with a file/memory JSON database layer, making it instantly runnable locally and cloud-ready for Vercel Serverless deployment without mandatory external DB configuration.
- **Responsive Layout**: Designed for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Modern Vanilla CSS Design Tokens (Custom Lime Green & White Design System)
- **Authentication**: JWT (`jose` / `jsonwebtoken`), `bcryptjs`, HTTP-only Cookies
- **Icons**: `lucide-react`
- **Deployment Target**: Vercel

---

## 📦 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts       # POST /api/auth/login
│   │   │   │   ├── logout/route.ts      # POST /api/auth/logout
│   │   │   │   ├── me/route.ts          # GET /api/auth/me
│   │   │   │   └── register/route.ts    # POST /api/auth/register
│   │   │   └── blogs/
│   │   │       ├── route.ts             # GET, POST /api/blogs
│   │   │       └── [id]/route.ts        # GET, PUT, DELETE /api/blogs/:id
│   │   ├── blogs/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/page.tsx        # Edit existing blog
│   │   │   │   └── page.tsx             # Single blog reader
│   │   │   └── create/page.tsx          # Create new blog
│   │   ├── login/page.tsx               # Login page
│   │   ├── register/page.tsx            # Register page
│   │   ├── globals.css                  # Lime Green & White design system
│   │   ├── layout.tsx                   # Root layout with AuthProvider & Navbar
│   │   └── page.tsx                     # Home page with hero, search & feed
│   ├── components/
│   │   ├── Navbar.tsx                   # Glassmorphic top navigation
│   │   └── Footer.tsx                   # Aesthetic footer
│   ├── context/
│   │   └── AuthContext.tsx              # React Context for auth state
│   ├── lib/
│   │   ├── auth.ts                      # JWT sign & verify helpers
│   │   └── db.ts                        # Storage and CRUD helper
│   └── types/
│       └── index.ts                     # User & Blog TypeScript interfaces
├── package.json
└── README.md
```

---

## 📡 REST API Reference

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & set JWT cookie | No |
| `POST` | `/api/auth/logout` | Clear auth cookie | No |
| `GET` | `/api/auth/me` | Fetch active user session | Optional |

### 📝 Blogs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/blogs` | Get all blogs (supports `?q=` and `?category=`) | No |
| `POST` | `/api/blogs` | Create a new blog post | **Yes** |
| `GET` | `/api/blogs/:id` | Get details for a single blog | No |
| `PUT` | `/api/blogs/:id` | Update blog (owner only) | **Yes (Owner)** |
| `DELETE` | `/api/blogs/:id` | Delete blog (owner only) | **Yes (Owner)** |

#### Example Request Body for `POST /api/blogs`:
```json
{
  "title": "Clean Architecture in Next.js",
  "category": "Architecture",
  "summary": "Building resilient apps with decoupled boundaries.",
  "content": "Full article markdown or body text goes here..."
}
```

---

## ⚡ Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/Sathyajith13-ENG/Full-Stack-Blog-Application.git
cd Full-Stack-Blog-Application
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Demo Credentials
The application includes initial seed data so you can test immediately:
- **Email**: `alex@example.com`
- **Password**: `Password@123`
*(Or click **Get Started** to register a new user in 5 seconds!)*

---

## 🚀 How to Deploy to Vercel (Step-by-Step)

Deploying this application to **Vercel** takes under 2 minutes:

### Option A: Via GitHub (Recommended)
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete full stack blog application"
   git push origin main
   ```
2. Navigate to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New..."** &rarr; **"Project"**.
4. Select `Full-Stack-Blog-Application` from your GitHub repositories and click **Import**.
5. **Configure Project**:
   - Framework Preset: **Next.js** (Automatically detected).
   - Root Directory: `./` (Default).
   - Environment Variables (Optional):
     - `JWT_SECRET`: Enter any custom secret string (e.g. `your-super-secret-key-32-chars-long`).
6. Click **Deploy**. Vercel will build and assign you a live `.vercel.app` URL!

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy directly from terminal
vercel
```
Follow the brief prompts and choose the default options. Your app will be deployed and a live production link will be provided.

---

## 🛡️ Validation & Error Handling
- **Frontend**: Required fields, minimum password length (6 characters), confirmation matching, and user feedback toast alerts.
- **Backend**: Strict payload type validation, 400 Bad Request responses for missing fields, 401 Unauthorized for invalid/missing JWT, 403 Forbidden for unauthorized edit/delete operations, and 404 for missing entities.

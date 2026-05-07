# FullStackFlow Portfolio

A modern, responsive portfolio website built with Next.js, Neon PostgreSQL, and Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, RSC), React, TypeScript, Tailwind CSS
- **Backend**: Neon PostgreSQL (serverless), Vercel Analytics
- **UI**: Lucide React Icons, shadcn/ui (New York), Custom CSS Animations
- **Email**: Resend API
- **Deployment**: Vercel

## Features

### ✨ Core Features
- **Responsive Design**: Mobile-first, adapts to all screen sizes
- **Dark Theme**: Professional dark mode with blue/cyan accents
- **Animations**: Smooth transitions, snowfall effects, fade-in animations
- **Certificate Management**: Organize certificates by 8 expertise domains
- **Project Portfolio**: Showcase projects with images, descriptions, and links
- **Contact Form**: Receive and manage contact messages (via Resend)
- **Admin Panel**: Secure password-protected admin dashboard
- **Skills Section**: Visual skills display with progress bars by domain

### 🛡️ Admin Panel Features
1. **Projects Management**: Add, edit, delete portfolio projects with local image uploads
2. **Messages Management**: View received messages, mark as read/unread, delete
3. **Certificates Management**: Add, edit, delete certificates by expertise domain

### 🌐 Pages
- `/` - Homepage with hero, portfolio tabs, expertise with certificates, collaboration CTA
- `/certificates` - All certificates organized by expertise domain
- `/admin` - Admin panel (password protected)

### 📁 Project Structure

```
app/
├── api/
│   ├── certificates/
│   │   ├── route.ts (GET, POST)
│   │   └── [id]/route.ts (GET, PUT, DELETE)
│   ├── messages/
│   │   ├── route.ts (GET, POST)
│   │   └── [id]/route.ts (GET, PATCH, DELETE)
│   ├── projects/
│   │   ├── route.ts (GET, POST)
│   │   └── [id]/route.ts (GET, PUT, DELETE)
│   ├── admin/
│   ├── certificates/
│   │   └── page.tsx
│   └── page.tsx

components/
├── portfolio/
│   ├── expertise-with-certificates.tsx
│   ├── skills-section.tsx
│   ├── portfolio-tabs.tsx
│   └── ...
├── admin/
│   ├── admin-auth.tsx
│   ├── projects-manager.tsx
│   ├── messages-manager.tsx
│   └── certificates-manager.tsx
├── collaboration-cta.tsx
├── contact-form.tsx
└── snowfall-animation.tsx

lib/
├── db.ts (Neon PostgreSQL client and types)
├── send-email.ts (Resend email service)
└── utils.ts

scripts/
├── 001_create_tables.sql (Database schema)
└── 002_seed_projects.sql (Initial data)
```

### 📊 Database Schema

**certificates** table
- id (integer, primary key)
- title (text)
- domain (text) - One of 8 expertise domains
- issuer (text)
- certificate_url (text, nullable)
- date_obtained (date)
- image_url (text, nullable)
- badge_url (text, nullable)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)

**contact_messages** table
- id (integer, primary key)
- name (text)
- email (text)
- message (text)
- read (boolean)
- created_at (timestamp)

**projects** table
- id (integer, primary key)
- title (text)
- category (text)
- description (text)
- tags (text[])
- link (text, nullable)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)

### 🔌 API Endpoints

#### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create certificate
- `GET /api/certificates/[id]` - Get certificate by ID
- `PUT /api/certificates/[id]` - Update certificate
- `DELETE /api/certificates/[id]` - Delete certificate

#### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Submit contact form
- `GET /api/messages/[id]` - Get message by ID
- `PATCH /api/messages/[id]` - Toggle read status
- `DELETE /api/messages/[id]` - Delete message

#### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/FullStackFlow-dev/v0-merph-ing-portfolio.git
   cd v0-merph-ing-portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your DATABASE_URL (Neon PostgreSQL) and RESEND_API_KEY
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

### 📦 Deployment

The project is configured for Vercel deployment with proper environment variable management.

1. **Connect GitHub to Vercel** via https://vercel.com/new
2. **Configure Environment Variables** in Project Settings:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string (required)
   - `RESEND_API_KEY` - Your Resend API key for email notifications (optional)

3. **Deploy** - Push to main branch triggers automatic deployment

### ⚙️ Vercel Configuration

The `vercel.json` file handles:
- Build command: `pnpm build`
- Install command: `pnpm install`
- Framework: Next.js
- Region: cdg1 (Paris, closest to Dakar)
- `buildEnv`: Exposes `DATABASE_URL` and `RESEND_API_KEY` during build
- `env`: Maps variables to Vercel secrets (`@database_url`, `@resend_api_key`)

### 🔐 Security Notes

- Admin panel is password protected with token-based sessions (localStorage)
- All sensitive credentials stored in Vercel environment variables
- Database queries use parameterized SQL via Neon serverless client
- No hardcoded secrets in the codebase
- Type-safe database layer with TypeScript

### 📝 Expertise Domains

The portfolio tracks certifications across 8 expertise domains:

1. Ingénieur logiciel généraliste
2. Développeur logiciel Full Stack IBM
3. DevOps et ingénierie logiciel IBM
4. Data Scientist IBM
5. Data Analyst Meta
6. Deep Learning et TensorFlow
7. Apprentissage automatique avec Python
8. Apprentissage supervisé et non supervisé

### 🎨 Design System

- **Color Palette**:
  - Primary: Blue (#3B82F6)
  - Secondary: Cyan (#06B6D4)
  - Background: Slate-900 (#0F172A)
  - Accent: Gradient from Blue to Cyan

- **Typography**: Professional sans-serif with careful hierarchy
- **Spacing**: 8px grid system via Tailwind
- **Animations**: Smooth transitions, fade-ins, glow effects

### 📞 Support

For issues or questions, open an issue on GitHub or contact via the portfolio contact form.

---

Built with ❤️ by FullStackFlow

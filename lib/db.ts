import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production. Set it in Vercel project settings under Environment Variables."
    )
  }
  console.warn(
    "[db.ts] DATABASE_URL not found. Database calls will fail. Set it locally with .env.local or on Vercel project settings."
  )
}

export const sql = neon(databaseUrl || "postgresql://localhost/stub")

export type ContactMessage = {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

export type Project = {
  id: number
  title: string
  category: string
  description: string
  tags: string[]
  link: string | null
  display_order: number
  created_at: string
  updated_at: string
}

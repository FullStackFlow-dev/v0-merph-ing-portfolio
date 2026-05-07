import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl && process.env.NODE_ENV === "production") {
  throw new Error(
    "DATABASE_URL is required in production. Configure it in Vercel project settings."
  )
}

export const sql = neon(databaseUrl || "")

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

import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL n'est pas définie")
}

export const sql = neon(process.env.DATABASE_URL)

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

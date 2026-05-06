import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL n'est pas definie. Configurez cette variable d'environnement dans Vercel.")
}

export const sql = neon(databaseUrl ?? "postgresql://placeholder:placeholder@localhost/placeholder")

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

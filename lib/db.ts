import { neon } from "@neondatabase/serverless"

let sqlClient: ReturnType<typeof neon> | null = null

export function getSql() {
  if (sqlClient) {
    return sqlClient
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL n'est pas définie")
  }

  sqlClient = neon(databaseUrl)
  return sqlClient
}

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

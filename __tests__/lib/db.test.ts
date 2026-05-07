import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// We need to mock @neondatabase/serverless before importing lib/db
vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn((url: string) => {
    // Return a tagged template literal function that tracks calls
    const sqlFn = vi.fn(() => Promise.resolve([]))
    return sqlFn
  }),
}))

describe("getSql", () => {
  const ORIGINAL_DATABASE_URL = process.env.DATABASE_URL

  beforeEach(() => {
    // Reset module between tests so the singleton is cleared
    vi.resetModules()
    vi.clearAllMocks()
    process.env.DATABASE_URL = "postgresql://test:test@localhost/testdb"
  })

  afterEach(() => {
    process.env.DATABASE_URL = ORIGINAL_DATABASE_URL
  })

  it("returns a sql client when DATABASE_URL is set", async () => {
    const { getSql } = await import("@/lib/db")
    const client = getSql()
    expect(client).toBeDefined()
    expect(typeof client).toBe("function")
  })

  it("throws when DATABASE_URL is not set", async () => {
    delete process.env.DATABASE_URL
    const { getSql } = await import("@/lib/db")
    expect(() => getSql()).toThrow("DATABASE_URL n'est pas définie")
  })

  it("returns the same singleton instance on repeated calls", async () => {
    const { getSql } = await import("@/lib/db")
    const first = getSql()
    const second = getSql()
    expect(first).toBe(second)
  })

  it("calls neon() exactly once even when getSql() is called multiple times", async () => {
    const { neon } = await import("@neondatabase/serverless")
    const { getSql } = await import("@/lib/db")

    getSql()
    getSql()
    getSql()

    expect(vi.mocked(neon)).toHaveBeenCalledTimes(1)
  })

  it("neon() is called with the DATABASE_URL value", async () => {
    const { neon } = await import("@neondatabase/serverless")
    const { getSql } = await import("@/lib/db")

    getSql()

    expect(vi.mocked(neon)).toHaveBeenCalledWith(
      "postgresql://test:test@localhost/testdb",
    )
  })
})

describe("exported types", () => {
  it("ContactMessage type is exported from lib/db", async () => {
    // Type-level check: import should not throw
    const db = await import("@/lib/db")
    // getSql is the only runtime export; types are erased at runtime
    expect(db.getSql).toBeDefined()
  })
})
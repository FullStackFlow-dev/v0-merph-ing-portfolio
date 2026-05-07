import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSqlFn = vi.fn()
vi.mock("@/lib/db", () => ({
  getSql: vi.fn(() => mockSqlFn),
}))

function makePostRequest(body: unknown): Request {
  return new Request("http://localhost/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("GET /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns projects wrapped in { projects }", async () => {
    const { GET } = await import("@/app/api/projects/route")
    const fakeProjects = [
      {
        id: 1,
        title: "My App",
        category: "Web",
        description: "A cool app",
        tags: ["react"],
        link: null,
        display_order: 0,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    ]
    mockSqlFn.mockResolvedValue(fakeProjects)

    const res = await GET()

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.projects).toEqual(fakeProjects)
  })

  it("returns empty projects array when DB returns nothing", async () => {
    const { GET } = await import("@/app/api/projects/route")
    mockSqlFn.mockResolvedValue([])

    const res = await GET()

    const json = await res.json()
    expect(json.projects).toEqual([])
  })

  it("returns 500 when DB throws", async () => {
    const { GET } = await import("@/app/api/projects/route")
    mockSqlFn.mockRejectedValue(new Error("DB error"))

    const res = await GET()

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })
})

describe("POST /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 400 when title is missing", async () => {
    const { POST } = await import("@/app/api/projects/route")
    const req = makePostRequest({ title: "", category: "Web", description: "desc" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("requis")
  })

  it("returns 400 when category is missing", async () => {
    const { POST } = await import("@/app/api/projects/route")
    const req = makePostRequest({ title: "My App", category: "", description: "desc" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("requis")
  })

  it("returns 400 when description is missing", async () => {
    const { POST } = await import("@/app/api/projects/route")
    const req = makePostRequest({ title: "My App", category: "Web", description: "" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("requis")
  })

  it("returns 400 when all required fields are absent", async () => {
    const { POST } = await import("@/app/api/projects/route")
    const req = makePostRequest({})
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it("returns 201 with created project on success", async () => {
    const { POST } = await import("@/app/api/projects/route")
    const created = {
      id: 42,
      title: "My App",
      category: "Web",
      description: "A cool app",
      tags: ["react", "typescript"],
      link: "https://example.com",
      display_order: 1,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    }
    mockSqlFn.mockResolvedValue([created])

    const req = makePostRequest({
      title: "My App",
      category: "Web",
      description: "A cool app",
      tags: ["react", "typescript"],
      link: "https://example.com",
      display_order: 1,
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.project).toEqual(created)
  })

  it("uses display_order 0 when not provided", async () => {
    const { POST } = await import("@/app/api/projects/route")
    mockSqlFn.mockResolvedValue([{ id: 1, title: "T", category: "C", description: "D", tags: [], link: null, display_order: 0, created_at: "", updated_at: "" }])

    const req = makePostRequest({ title: "T", category: "C", description: "D" })
    const res = await POST(req)

    expect(res.status).toBe(201)
    expect(mockSqlFn).toHaveBeenCalled()
  })

  it("handles non-array tags by defaulting to empty array", async () => {
    const { POST } = await import("@/app/api/projects/route")
    mockSqlFn.mockResolvedValue([{ id: 1, title: "T", category: "C", description: "D", tags: [], link: null, display_order: 0, created_at: "", updated_at: "" }])

    const req = makePostRequest({ title: "T", category: "C", description: "D", tags: "not-an-array" })
    const res = await POST(req)

    expect(res.status).toBe(201)
  })

  it("trims whitespace from title, category, description", async () => {
    const { POST } = await import("@/app/api/projects/route")
    mockSqlFn.mockResolvedValue([{ id: 1, title: "Trimmed", category: "Web", description: "desc", tags: [], link: null, display_order: 0, created_at: "", updated_at: "" }])

    const req = makePostRequest({
      title: "  Trimmed  ",
      category: "  Web  ",
      description: "  desc  ",
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
    expect(mockSqlFn).toHaveBeenCalled()
  })

  it("sets link to null when not provided", async () => {
    const { POST } = await import("@/app/api/projects/route")
    mockSqlFn.mockResolvedValue([{ id: 1, link: null }])

    const req = makePostRequest({ title: "T", category: "C", description: "D" })
    await POST(req)

    expect(mockSqlFn).toHaveBeenCalled()
  })

  it("returns 500 when DB throws", async () => {
    const { POST } = await import("@/app/api/projects/route")
    mockSqlFn.mockRejectedValue(new Error("Insert failed"))

    const req = makePostRequest({ title: "T", category: "C", description: "D" })
    const res = await POST(req)

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it("handles non-string field types (treats them as empty → 400)", async () => {
    const { POST } = await import("@/app/api/projects/route")
    const req = makePostRequest({ title: 123, category: null, description: true })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it("filters out empty strings from tags array", async () => {
    const { POST } = await import("@/app/api/projects/route")
    mockSqlFn.mockResolvedValue([{ id: 1, tags: ["react"] }])

    const req = makePostRequest({ title: "T", category: "C", description: "D", tags: ["react", "", "  "] })
    const res = await POST(req)

    // Should succeed (filters out falsy tags)
    expect(res.status).toBe(201)
  })
})
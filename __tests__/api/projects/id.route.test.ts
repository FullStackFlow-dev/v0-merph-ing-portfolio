import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSqlFn = vi.fn()
vi.mock("@/lib/db", () => ({
  getSql: vi.fn(() => mockSqlFn),
}))

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) }
}

function makePutRequest(body: unknown): Request {
  return new Request("http://localhost/api/projects/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

const validProject = {
  id: 1,
  title: "My App",
  category: "Web",
  description: "A cool app",
  tags: ["react"],
  link: null,
  display_order: 0,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
}

describe("GET /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the project wrapped in { project } for a valid ID", async () => {
    const { GET } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([validProject])

    const res = await GET(new Request("http://localhost"), makeParams("1"))

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.project).toEqual(validProject)
  })

  it("returns 400 for a non-numeric ID", async () => {
    const { GET } = await import("@/app/api/projects/[id]/route")

    const res = await GET(new Request("http://localhost"), makeParams("abc"))

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("ID invalide")
  })

  it("returns 404 when the project does not exist", async () => {
    const { GET } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([])

    const res = await GET(new Request("http://localhost"), makeParams("999"))

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it("returns 400 for NaN string ID", async () => {
    const { GET } = await import("@/app/api/projects/[id]/route")

    const res = await GET(new Request("http://localhost"), makeParams("NaN"))

    expect(res.status).toBe(400)
  })

  it("returns 500 when DB throws", async () => {
    const { GET } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockRejectedValue(new Error("DB error"))

    const res = await GET(new Request("http://localhost"), makeParams("1"))

    expect(res.status).toBe(500)
  })
})

describe("PUT /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 400 for a non-numeric ID", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    const req = makePutRequest({ title: "T", category: "C", description: "D" })

    const res = await PUT(req, makeParams("xyz"))

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("ID invalide")
  })

  it("returns 400 when title is missing", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    const req = makePutRequest({ title: "", category: "Web", description: "desc" })

    const res = await PUT(req, makeParams("1"))

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("requis")
  })

  it("returns 400 when category is missing", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    const req = makePutRequest({ title: "T", category: "", description: "D" })

    const res = await PUT(req, makeParams("1"))

    expect(res.status).toBe(400)
  })

  it("returns 400 when description is missing", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    const req = makePutRequest({ title: "T", category: "C", description: "" })

    const res = await PUT(req, makeParams("1"))

    expect(res.status).toBe(400)
  })

  it("returns updated project on success", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    const updated = { ...validProject, title: "Updated App" }
    mockSqlFn.mockResolvedValue([updated])

    const req = makePutRequest({
      title: "Updated App",
      category: "Web",
      description: "A cool app",
      tags: ["react"],
      display_order: 0,
    })
    const res = await PUT(req, makeParams("1"))

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.project.title).toBe("Updated App")
  })

  it("returns 404 when no rows are updated (project not found)", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([])

    const req = makePutRequest({ title: "T", category: "C", description: "D" })
    const res = await PUT(req, makeParams("9999"))

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it("returns 500 when DB throws", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockRejectedValue(new Error("DB error"))

    const req = makePutRequest({ title: "T", category: "C", description: "D" })
    const res = await PUT(req, makeParams("1"))

    expect(res.status).toBe(500)
  })

  it("uses display_order 0 when non-numeric display_order is provided", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([validProject])

    const req = makePutRequest({
      title: "T",
      category: "C",
      description: "D",
      display_order: "not-a-number",
    })
    const res = await PUT(req, makeParams("1"))

    expect(res.status).toBe(200)
  })

  it("handles missing tags by defaulting to empty array", async () => {
    const { PUT } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([validProject])

    const req = makePutRequest({ title: "T", category: "C", description: "D" })
    const res = await PUT(req, makeParams("1"))

    expect(res.status).toBe(200)
  })
})

describe("DELETE /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns { ok: true } for a valid numeric ID", async () => {
    const { DELETE } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([])

    const res = await DELETE(new Request("http://localhost"), makeParams("1"))

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  it("returns 400 for a non-numeric ID", async () => {
    const { DELETE } = await import("@/app/api/projects/[id]/route")

    const res = await DELETE(new Request("http://localhost"), makeParams("notanumber"))

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("ID invalide")
  })

  it("treats empty string ID as 0 (Number('') === 0 is finite) and proceeds", async () => {
    const { DELETE } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([])

    // Number("") === 0, Number.isFinite(0) === true, so empty string is treated as ID 0
    const res = await DELETE(new Request("http://localhost"), makeParams(""))

    expect(res.status).toBe(200)
  })

  it("returns 400 for Infinity ID", async () => {
    const { DELETE } = await import("@/app/api/projects/[id]/route")

    const res = await DELETE(new Request("http://localhost"), makeParams("Infinity"))

    expect(res.status).toBe(400)
  })

  it("returns 500 when DB throws", async () => {
    const { DELETE } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockRejectedValue(new Error("DB error"))

    const res = await DELETE(new Request("http://localhost"), makeParams("1"))

    expect(res.status).toBe(500)
  })

  it("accepts negative numeric ID (passes to DB)", async () => {
    const { DELETE } = await import("@/app/api/projects/[id]/route")
    mockSqlFn.mockResolvedValue([])

    const res = await DELETE(new Request("http://localhost"), makeParams("-1"))

    // -1 is a finite number so it passes ID validation
    expect(res.status).toBe(200)
  })
})
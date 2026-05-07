import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSqlFn = vi.fn()
vi.mock("@/lib/db", () => ({
  getSql: vi.fn(() => mockSqlFn),
}))

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) }
}

describe("DELETE /api/contact/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns { ok: true } when a valid numeric ID is given", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")
    mockSqlFn.mockResolvedValue([])

    const res = await DELETE(new Request("http://localhost"), makeParams("5"))

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  it("returns 400 for a non-numeric ID", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")

    const res = await DELETE(new Request("http://localhost"), makeParams("abc"))

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("ID invalide")
  })

  it("treats empty string ID as 0 (Number('') === 0 is finite) and proceeds", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")
    mockSqlFn.mockResolvedValue([])

    // Number("") === 0, Number.isFinite(0) === true, so empty string is treated as ID 0
    const res = await DELETE(new Request("http://localhost"), makeParams(""))

    expect(res.status).toBe(200)
  })

  it("returns 400 for NaN (e.g., 'NaN' string)", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")

    const res = await DELETE(new Request("http://localhost"), makeParams("NaN"))

    expect(res.status).toBe(400)
  })

  it("returns 400 for Infinity string", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")

    const res = await DELETE(new Request("http://localhost"), makeParams("Infinity"))

    expect(res.status).toBe(400)
  })

  it("calls SQL DELETE with the numeric ID", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")
    mockSqlFn.mockResolvedValue([])

    await DELETE(new Request("http://localhost"), makeParams("99"))

    expect(mockSqlFn).toHaveBeenCalled()
  })

  it("returns 500 when DB throws", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")
    mockSqlFn.mockRejectedValue(new Error("DB error"))

    const res = await DELETE(new Request("http://localhost"), makeParams("3"))

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it("accepts ID '0' as a valid numeric value", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")
    mockSqlFn.mockResolvedValue([])

    const res = await DELETE(new Request("http://localhost"), makeParams("0"))

    expect(res.status).toBe(200)
  })

  it("accepts a large valid ID", async () => {
    const { DELETE } = await import("@/app/api/contact/[id]/route")
    mockSqlFn.mockResolvedValue([])

    const res = await DELETE(new Request("http://localhost"), makeParams("999999"))

    expect(res.status).toBe(200)
  })
})
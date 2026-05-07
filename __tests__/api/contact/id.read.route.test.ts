import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSqlFn = vi.fn()
vi.mock("@/lib/db", () => ({
  getSql: vi.fn(() => mockSqlFn),
}))

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) }
}

describe("PATCH /api/contact/[id]/read", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns { ok: true } for a valid numeric ID", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")
    mockSqlFn.mockResolvedValue([])

    const res = await PATCH(new Request("http://localhost"), makeParams("10"))

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  it("returns 400 for a non-numeric ID", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")

    const res = await PATCH(new Request("http://localhost"), makeParams("foo"))

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("ID invalide")
  })

  it("treats empty string ID as 0 (Number('') === 0 is finite) and proceeds", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")
    mockSqlFn.mockResolvedValue([])

    // Number("") === 0, Number.isFinite(0) === true, so empty string is treated as ID 0
    const res = await PATCH(new Request("http://localhost"), makeParams(""))

    expect(res.status).toBe(200)
  })

  it("returns 400 for NaN string", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")

    const res = await PATCH(new Request("http://localhost"), makeParams("NaN"))

    expect(res.status).toBe(400)
  })

  it("calls SQL UPDATE with the numeric ID", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")
    mockSqlFn.mockResolvedValue([])

    await PATCH(new Request("http://localhost"), makeParams("15"))

    expect(mockSqlFn).toHaveBeenCalled()
  })

  it("returns 500 when DB throws", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")
    mockSqlFn.mockRejectedValue(new Error("Connection refused"))

    const res = await PATCH(new Request("http://localhost"), makeParams("5"))

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it("accepts ID '1' as boundary value", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")
    mockSqlFn.mockResolvedValue([])

    const res = await PATCH(new Request("http://localhost"), makeParams("1"))

    expect(res.status).toBe(200)
  })

  it("returns 400 for float-like string IDs (Infinity)", async () => {
    const { PATCH } = await import("@/app/api/contact/[id]/read/route")

    const res = await PATCH(new Request("http://localhost"), makeParams("Infinity"))

    expect(res.status).toBe(400)
  })
})
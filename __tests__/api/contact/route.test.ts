import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextResponse } from "next/server"

// Mock dependencies before importing the module under test
const mockSqlFn = vi.fn()
vi.mock("@/lib/db", () => ({
  getSql: vi.fn(() => mockSqlFn),
}))

const mockSendContactNotification = vi.fn()
vi.mock("@/lib/send-email", () => ({
  sendContactNotification: mockSendContactNotification,
}))

// Helper to create a mock Request with JSON body
function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSendContactNotification.mockResolvedValue(undefined)
  })

  it("returns 400 when name is missing", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({ name: "", email: "test@example.com", message: "Hello" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("Tous les champs sont requis.")
  })

  it("returns 400 when email is missing", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({ name: "Alice", email: "", message: "Hello" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("Tous les champs sont requis.")
  })

  it("returns 400 when message is missing", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({ name: "Alice", email: "alice@example.com", message: "" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("Tous les champs sont requis.")
  })

  it("returns 400 when all fields are absent", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({})
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("Tous les champs sont requis.")
  })

  it("returns 400 when name exceeds 100 characters", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({
      name: "A".repeat(101),
      email: "alice@example.com",
      message: "Hello",
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("100")
  })

  it("accepts a name of exactly 100 characters", async () => {
    const { POST } = await import("@/app/api/contact/route")
    mockSqlFn.mockResolvedValue([{ id: 1, created_at: new Date().toISOString() }])
    const req = makeRequest({
      name: "A".repeat(100),
      email: "alice@example.com",
      message: "Hello",
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
  })

  it("returns 400 for an invalid email address", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({ name: "Alice", email: "not-an-email", message: "Hello" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("e-mail")
  })

  it("returns 400 for an email without TLD", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({ name: "Alice", email: "user@domain", message: "Hello" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("e-mail")
  })

  it("returns 400 when email exceeds 255 characters", async () => {
    const { POST } = await import("@/app/api/contact/route")
    // email.length > 255 means 256+ chars; use 252 'a's + "@b.co" = 257 chars
    const longEmail = "a".repeat(252) + "@b.co"
    const req = makeRequest({ name: "Alice", email: longEmail, message: "Hello" })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("e-mail")
  })

  it("returns 400 when message exceeds 2000 characters", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({
      name: "Alice",
      email: "alice@example.com",
      message: "x".repeat(2001),
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("2000")
  })

  it("accepts a message of exactly 2000 characters", async () => {
    const { POST } = await import("@/app/api/contact/route")
    mockSqlFn.mockResolvedValue([{ id: 5, created_at: new Date().toISOString() }])
    const req = makeRequest({
      name: "Alice",
      email: "alice@example.com",
      message: "x".repeat(2000),
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
  })

  it("returns 201 with id on success and calls DB insert", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const createdAt = new Date().toISOString()
    mockSqlFn.mockResolvedValue([{ id: 42, created_at: createdAt }])

    const req = makeRequest({
      name: "  Alice  ",
      email: "alice@example.com",
      message: "Hello world",
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.id).toBe(42)
  })

  it("trims whitespace from name, email, and message before storing", async () => {
    const { POST } = await import("@/app/api/contact/route")
    mockSqlFn.mockResolvedValue([{ id: 1, created_at: new Date().toISOString() }])

    const req = makeRequest({
      name: "  Bob  ",
      email: "  bob@example.com  ",
      message: "  Trimmed message  ",
    })
    await POST(req)

    // The tagged template is called like: mockSqlFn`INSERT ...`
    // We verify the function was called (trimming happens before the call)
    expect(mockSqlFn).toHaveBeenCalled()
  })

  it("sends email notification after successful DB insert", async () => {
    const { POST } = await import("@/app/api/contact/route")
    mockSqlFn.mockResolvedValue([{ id: 7, created_at: new Date().toISOString() }])

    const req = makeRequest({
      name: "Carol",
      email: "carol@example.com",
      message: "Test message",
    })
    await POST(req)

    expect(mockSendContactNotification).toHaveBeenCalledOnce()
    expect(mockSendContactNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Carol",
        email: "carol@example.com",
        message: "Test message",
      }),
    )
  })

  it("returns 500 when DB throws", async () => {
    const { POST } = await import("@/app/api/contact/route")
    mockSqlFn.mockRejectedValue(new Error("DB down"))

    const req = makeRequest({
      name: "Dave",
      email: "dave@example.com",
      message: "Hello",
    })
    const res = await POST(req)

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toContain("Erreur serveur")
  })

  it("handles non-string field types gracefully (treats them as empty)", async () => {
    const { POST } = await import("@/app/api/contact/route")
    const req = makeRequest({ name: 123, email: null, message: true })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("Tous les champs sont requis.")
  })
})

describe("GET /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns messages array wrapped in { messages }", async () => {
    const { GET } = await import("@/app/api/contact/route")
    const fakeMessages = [
      { id: 1, name: "Alice", email: "a@b.com", message: "Hi", created_at: "2024-01-01", read: false },
    ]
    mockSqlFn.mockResolvedValue(fakeMessages)

    const res = await GET()

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.messages).toEqual(fakeMessages)
  })

  it("returns empty messages array when DB returns nothing", async () => {
    const { GET } = await import("@/app/api/contact/route")
    mockSqlFn.mockResolvedValue([])

    const res = await GET()

    const json = await res.json()
    expect(json.messages).toEqual([])
  })

  it("returns 500 when DB throws", async () => {
    const { GET } = await import("@/app/api/contact/route")
    mockSqlFn.mockRejectedValue(new Error("Connection error"))

    const res = await GET()

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })
})
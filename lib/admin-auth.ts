import crypto from "node:crypto"

const SESSION_COOKIE = "admin_session"

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

export function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) return false
  const inputHash = sha256(password)
  const a = Buffer.from(inputHash)
  const b = Buffer.from(hash)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function createAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error("ADMIN_SESSION_SECRET manquant")
  const payload = `${Date.now()}.${crypto.randomBytes(16).toString("hex")}`
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return `${payload}.${sig}`
}

export function verifyAdminSession(token?: string) {
  if (!token) return false
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [ts, nonce, sig] = parts
  const payload = `${ts}.${nonce}`
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  const ok = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  if (!ok) return false
  const age = Date.now() - Number(ts)
  return Number.isFinite(age) && age >= 0 && age < 1000 * 60 * 60 * 12
}

export { SESSION_COOKIE }

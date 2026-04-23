import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export type ContactNotification = {
  name: string
  email: string
  message: string
  createdAt: Date
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendContactNotification(data: ContactNotification) {
  if (!resend) {
    console.log("[v0] RESEND_API_KEY manquante — email non envoyé")
    return { skipped: true }
  }

  const html = `
    <div style="font-family: 'Instrument Sans', system-ui, sans-serif; background: #F8FAFC; padding: 32px; color: #0F172A;">
      <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden;">
        <div style="padding: 24px; border-bottom: 1px solid #E2E8F0;">
          <p style="margin: 0; font-size: 12px; color: #64748B; letter-spacing: 0.05em; text-transform: uppercase;">Nouveau message</p>
          <h1 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 500; color: #0F172A;">Portfolio Merph-dev</h1>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-size: 14px; width: 100px;">Nom</td>
              <td style="padding: 8px 0; color: #0F172A; font-size: 14px;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; color: #0F172A; font-size: 14px;">${escapeHtml(data.email)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-size: 14px;">Date</td>
              <td style="padding: 8px 0; color: #0F172A; font-size: 14px;">${data.createdAt.toLocaleString("fr-FR")}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #F1F5F9; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #0F172A; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
          <div style="margin-top: 24px; text-align: center;">
            <a href="https://merph-dev.vercel.app/admin" style="display: inline-block; padding: 10px 20px; background: #0F172A; color: #F8FAFC; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">Ouvrir le tableau de bord</a>
          </div>
        </div>
        <div style="padding: 16px 24px; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center;">
          Merph-dev Portfolio — Dakar, Sénégal
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: "Merph-dev Portfolio <onboarding@resend.dev>",
      to: "merphy97@gmail.com",
      replyTo: data.email,
      subject: `Nouveau message de ${data.name}`,
      html,
    })
    return { ok: true, result }
  } catch (error) {
    console.log("[v0] Erreur Resend:", error)
    return { ok: false, error }
  }
}

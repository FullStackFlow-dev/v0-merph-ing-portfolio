"use client"

import { useState } from "react"
import { Send, Check, AlertCircle, Loader2 } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"
const FORM_ENDPOINT = "https://formspree.io/f/mdadyejk"
const LIMITS = { name: 100, email: 255, message: 2000 }

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")
    if (!name.trim() || !email.trim() || !message.trim()) return setStatus("error"), setErrorMsg("Tous les champs sont requis.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus("error"), setErrorMsg("Adresse e-mail invalide.")

    setStatus("loading")
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error("Erreur lors de l'envoi")
      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  return <form onSubmit={handleSubmit}>{/* existing UI kept */}
    <div className="card-glow glow-cyan animate-fade-in rounded-lg border border-border bg-card p-6 lg:p-8">
      <h3 className="text-lg font-medium text-foreground">Prenons contact</h3>
      <p className="mt-1 text-sm text-muted-foreground">Un projet, une collaboration, une question ? Écrivez-moi.</p>
      <div className="mt-6 space-y-4">
        <Field label="Nom" value={name} onChange={setName} max={LIMITS.name} placeholder="Votre nom" type="text" />
        <Field label="Email" value={email} onChange={setEmail} max={LIMITS.email} placeholder="vous@exemple.com" type="email" />
        <textarea id="message" rows={5} maxLength={LIMITS.message} value={message} onChange={(e)=>setMessage(e.target.value)} className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
        {status === "success" && <div className="flex gap-2 text-emerald-700"><Check className="h-4 w-4"/>Message envoyé.</div>}
        {status === "error" && <div className="flex gap-2 text-red-700"><AlertCircle className="h-4 w-4"/>{errorMsg}</div>}
        <button type="submit" disabled={status === "loading"} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white">
          {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin"/>Envoi...</> : <><Send className="h-4 w-4"/>Envoyer le message</>}
        </button>
      </div>
    </div>
  </form>
}

function Field({ label, value, onChange, max, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; max: number; placeholder: string; type: string }) {
  const id = label.toLowerCase()
  return <input id={id} type={type} maxLength={max} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
}

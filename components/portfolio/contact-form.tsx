"use client"

import { useState } from "react"
import { Send, Check, AlertCircle, Loader2 } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

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

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error")
      setErrorMsg("Tous les champs sont requis.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error")
      setErrorMsg("Adresse e-mail invalide.")
      return
    }

    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de l'envoi")
      }
      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  return (
    <div className="card-glow glow-cyan animate-fade-in rounded-lg border border-border bg-card p-6 lg:p-8">
      <h3 className="text-lg font-medium text-foreground">Prenons contact</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Un projet, une collaboration, une question ? Écrivez-moi, je réponds
        sous 24 h.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field
          label="Nom"
          value={name}
          onChange={setName}
          max={LIMITS.name}
          placeholder="Votre nom"
          type="text"
        />
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          max={LIMITS.email}
          placeholder="vous@exemple.com"
          type="email"
        />
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="message"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Message
            </label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {message.length} / {LIMITS.message}
            </span>
          </div>
          <textarea
            id="message"
            rows={5}
            maxLength={LIMITS.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Parlez-moi de votre projet..."
            className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {status === "success" ? (
          <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>Message envoyé. Merci, je vous réponds rapidement.</span>
          </div>
        ) : null}
        {status === "error" ? (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              Envoi...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" strokeWidth={1.5} />
              Envoyer le message
            </>
          )}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  max,
  placeholder,
  type,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  max: number
  placeholder: string
  type: string
}) {
  const id = label.toLowerCase()
  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value.length} / {max}
        </span>
      </div>
      <input
        id={id}
        type={type}
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

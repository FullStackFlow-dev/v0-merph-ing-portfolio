"use client"

import { useMemo, useState } from "react"
import { Check, Mail, MailOpen, Trash2, Loader2 } from "lucide-react"
import type { ContactMessage } from "@/lib/db"

type Filter = "all" | "unread" | "read"

export function MessagesDashboard({
  initialMessages,
}: {
  initialMessages: ContactMessage[]
}) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [filter, setFilter] = useState<Filter>("all")
  const [busyId, setBusyId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(
    initialMessages[0]?.id ?? null,
  )

  const stats = useMemo(() => {
    const total = messages.length
    const unread = messages.filter((m) => !m.read).length
    return { total, unread, read: total - unread }
  }, [messages])

  const filtered = useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.read)
    if (filter === "read") return messages.filter((m) => m.read)
    return messages
  }, [messages, filter])

  const selected = messages.find((m) => m.id === selectedId) ?? null

  async function markAsRead(id: number) {
    setBusyId(id)
    try {
      const res = await fetch(`/api/contact/${id}/read`, { method: "PATCH" })
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
        )
      }
    } finally {
      setBusyId(null)
    }
  }

  async function deleteMessage(id: number) {
    if (!confirm("Supprimer ce message ?")) return
    setBusyId(id)
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        if (selectedId === id) setSelectedId(null)
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Non lus" value={stats.unread} highlight />
        <StatCard label="Lus" value={stats.read} />
      </div>

      <div className="flex items-center gap-1.5">
        <FilterPill
          label="Tous"
          count={stats.total}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterPill
          label="Non lus"
          count={stats.unread}
          active={filter === "unread"}
          onClick={() => setFilter("unread")}
        />
        <FilterPill
          label="Lus"
          count={stats.read}
          active={filter === "read"}
          onClick={() => setFilter("read")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Aucun message.
            </div>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={[
                  "flex w-full flex-col items-start gap-1 rounded-md border p-4 text-left transition-colors",
                  selectedId === m.id
                    ? "border-foreground bg-card"
                    : "border-border bg-card hover:border-foreground/40",
                ].join(" ")}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
                    {!m.read ? (
                      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    ) : null}
                    {m.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(m.created_at)}
                  </span>
                </div>
                <span className="truncate text-xs text-muted-foreground">
                  {m.email}
                </span>
                <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {m.message}
                </span>
              </button>
            ))
          )}
        </div>

        <div>
          {selected ? (
            <article className="sticky top-6 rounded-md border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-foreground">
                    {selected.name}
                  </h2>
                  <a
                    href={`mailto:${selected.email}`}
                    className="mt-0.5 inline-block text-sm text-muted-foreground hover:text-foreground"
                  >
                    {selected.email}
                  </a>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(selected.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!selected.read ? (
                    <button
                      onClick={() => markAsRead(selected.id)}
                      disabled={busyId === selected.id}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/40 disabled:opacity-60"
                    >
                      {busyId === selected.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                      )}
                      Marquer lu
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                      <MailOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Lu
                    </span>
                  )}
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    disabled={busyId === selected.id}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-400 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="mt-6 whitespace-pre-wrap rounded-md border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                {selected.message}
              </div>
            </article>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-border bg-card p-8 text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5" strokeWidth={1.5} />
                <p className="text-sm">Sélectionnez un message</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={[
          "mt-2 text-2xl font-medium tabular-nums",
          highlight && value > 0 ? "text-emerald-600" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  )
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "rounded-full px-1.5 text-xs tabular-nums",
          active ? "bg-background/20 text-background" : "bg-accent text-muted-foreground",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  )
}

function formatDate(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays === 0) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  if (diffDays === 1) return "Hier"
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

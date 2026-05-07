"use client"

import { useState } from "react"
import { Edit3, Loader2, Plus, Trash2, X, ExternalLink } from "lucide-react"
import type { Certificate } from "@/lib/db"

const DOMAINS = [
  "Ingénieur Logiciel Généraliste",
  "Développeur Logiciel Full Stack IBM",
  "DevOps et Ingénierie Logiciel IBM",
  "Data Scientist IBM",
  "Data Analyst Meta",
  "Deep Learning et TensorFlow",
  "Apprentissage Automatique avec Python",
  "Application avec Python",
]

type FormState = {
  id?: number
  title: string
  issuer: string
  domain: string
  date_obtained: string
  certificate_url: string
  image_url: string
  badge_url: string
  display_order: string
}

const emptyForm: FormState = {
  title: "",
  issuer: "",
  domain: DOMAINS[0],
  date_obtained: new Date().toISOString().split("T")[0],
  certificate_url: "",
  image_url: "",
  badge_url: "",
  display_order: "0",
}

export function CertificatesManager({
  initialCertificates,
}: {
  initialCertificates: Certificate[]
}) {
  const [certificates, setCertificates] = useState<Certificate[]>(
    initialCertificates,
  )
  const [form, setForm] = useState<FormState>(emptyForm)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function openCreate() {
    setForm(emptyForm)
    setMode("create")
    setError("")
    setOpen(true)
  }

  function openEdit(cert: Certificate) {
    setForm({
      id: cert.id,
      title: cert.title,
      issuer: cert.issuer,
      domain: cert.domain,
      date_obtained: cert.date_obtained.split("T")[0],
      certificate_url: cert.certificate_url ?? "",
      image_url: cert.image_url ?? "",
      badge_url: cert.badge_url ?? "",
      display_order: String(cert.display_order ?? 0),
    })
    setMode("edit")
    setError("")
    setOpen(true)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        issuer: form.issuer,
        domain: form.domain,
        date_obtained: form.date_obtained,
        certificate_url: form.certificate_url || null,
        image_url: form.image_url || null,
        badge_url: form.badge_url || null,
        display_order: Number(form.display_order) || 0,
      }
      const url =
        mode === "create"
          ? "/api/certificates"
          : `/api/certificates/${form.id}`
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur")
      if (mode === "create") {
        setCertificates((prev) => [data, ...prev])
      } else {
        setCertificates((prev) =>
          prev.map((c) => (c.id === data.id ? data : c)),
        )
      }
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce certificat ?")) return
    const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" })
    if (res.ok) {
      setCertificates((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {certificates.length} certificat
            {certificates.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Nouveau certificat
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-accent">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Domaine</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Émetteur</th>
              <th className="px-4 py-3 font-medium text-right">Ordre</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Aucun certificat.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">
                      {cert.title}
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {new Date(cert.date_obtained).toLocaleDateString(
                        "fr-FR",
                      )}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    <span className="inline-block rounded bg-accent px-2 py-1 text-xs">
                      {cert.domain}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {cert.issuer}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {cert.display_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {cert.certificate_url ? (
                        <a
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                          aria-label="Ouvrir le lien"
                        >
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            strokeWidth={1.5}
                          />
                        </a>
                      ) : null}
                      <button
                        onClick={() => openEdit(cert)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                        aria-label="Modifier"
                      >
                        <Edit3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => remove(cert.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-red-600 transition-colors hover:border-red-400 hover:bg-red-50"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-sm">
          <div className="mt-8 w-full max-w-2xl rounded-md border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-medium text-foreground">
                {mode === "create"
                  ? "Nouveau certificat"
                  : "Modifier le certificat"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4 px-6 py-5">
              <FormRow label="Titre" required>
                <input
                  required
                  maxLength={255}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input"
                />
              </FormRow>

              <div className="grid grid-cols-2 gap-3">
                <FormRow label="Émetteur" required>
                  <input
                    required
                    maxLength={255}
                    value={form.issuer}
                    onChange={(e) =>
                      setForm({ ...form, issuer: e.target.value })
                    }
                    className="input"
                    placeholder="Ex: IBM, Meta, Coursera"
                  />
                </FormRow>
                <FormRow label="Domaine" required>
                  <select
                    required
                    value={form.domain}
                    onChange={(e) =>
                      setForm({ ...form, domain: e.target.value })
                    }
                    className="input"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </FormRow>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormRow label="Date obtenue" required>
                  <input
                    required
                    type="date"
                    value={form.date_obtained}
                    onChange={(e) =>
                      setForm({ ...form, date_obtained: e.target.value })
                    }
                    className="input"
                  />
                </FormRow>
                <FormRow label="Ordre d'affichage">
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm({ ...form, display_order: e.target.value })
                    }
                    className="input"
                  />
                </FormRow>
              </div>

              <FormRow label="URL du certificat">
                <input
                  value={form.certificate_url}
                  onChange={(e) =>
                    setForm({ ...form, certificate_url: e.target.value })
                  }
                  className="input"
                  placeholder="https://example.com/verify/123"
                />
              </FormRow>

              <FormRow label="URL de l'image">
                <input
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  className="input"
                  placeholder="https://example.com/certificates/cert.jpg"
                />
              </FormRow>

              <FormRow label="URL du badge">
                <input
                  value={form.badge_url}
                  onChange={(e) =>
                    setForm({ ...form, badge_url: e.target.value })
                  }
                  className="input"
                  placeholder="https://example.com/badges/logo.png"
                />
              </FormRow>

              {error ? (
                <p className="rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-900">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-foreground/40"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      strokeWidth={1.5}
                    />
                  ) : null}
                  {mode === "create" ? "Créer" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
          <style>{`
            .input {
              width: 100%;
              border-radius: 6px;
              border: 1px solid var(--border);
              background: var(--background);
              padding: 0.625rem 0.75rem;
              font-size: 0.875rem;
              color: var(--foreground);
              outline: none;
              transition: border-color 0.15s;
            }
            .input:focus {
              border-color: var(--foreground);
            }
          `}</style>
        </div>
      ) : null}
    </div>
  )
}

function FormRow({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

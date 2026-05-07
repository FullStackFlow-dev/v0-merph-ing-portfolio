"use client"

import { useState } from "react"
import { Edit3, Loader2, Plus, Trash2, X, ExternalLink } from "lucide-react"
import type { Project } from "@/lib/db"

type FormState = {
  id?: number
  title: string
  category: string
  description: string
  tagsInput: string
  link: string
  display_order: string
}

const emptyForm: FormState = {
  title: "",
  category: "",
  description: "",
  tagsInput: "",
  link: "",
  display_order: "0",
}

export function ProjectsManager({
  initialProjects,
}: {
  initialProjects: Project[]
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
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

  function openEdit(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      category: p.category,
      description: p.description,
      tagsInput: (p.tags ?? []).join(", "),
      link: p.link ?? "",
      display_order: String(p.display_order ?? 0),
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
        category: form.category,
        description: form.description,
        link: form.link,
        display_order: Number(form.display_order) || 0,
        tags: form.tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }
      const url =
        mode === "create" ? "/api/projects" : `/api/projects/${form.id}`
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur")
      if (mode === "create") {
        setProjects((prev) => [data.project, ...prev])
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === data.project.id ? data.project : p)),
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
    if (!confirm("Supprimer ce projet ?")) return
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {projects.length} projet{projects.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Nouveau projet
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-accent">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Catégorie</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Tags</th>
              <th className="px-4 py-3 font-medium text-right">Ordre</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Aucun projet.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {p.description}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {p.category}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(p.tags ?? []).slice(0, 3).map((t) => (
                        <span key={t} className="pill">
                          {t}
                        </span>
                      ))}
                      {(p.tags ?? []).length > 3 ? (
                        <span className="text-xs text-muted-foreground">
                          +{(p.tags ?? []).length - 3}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {p.display_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.link ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                          aria-label="Ouvrir le lien"
                        >
                          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </a>
                      ) : null}
                      <button
                        onClick={() => openEdit(p)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                        aria-label="Modifier"
                      >
                        <Edit3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
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
          <div className="mt-8 w-full max-w-xl rounded-md border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-medium text-foreground">
                {mode === "create" ? "Nouveau projet" : "Modifier le projet"}
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
                  maxLength={200}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input"
                />
              </FormRow>
              <FormRow label="Catégorie d'expertise" required>
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                  <option value="">Choisir une expertise</option>
                  <option>Ingénieur logiciel généraliste méta (Front-end)</option>
                  <option>Ingénieur logiciel généraliste méta (Back-end)</option>
                  <option>Database Engineer</option>
                  <option>Développeur mobile iOS/Android</option>
                  <option>Développeur logiciel Full Stack IBM</option>
                  <option>Data Scientist IBM</option>
                  <option>Data Analyst Meta</option>
                  <option>DevOps et ingénierie logiciel IBM</option>
                  <option>Deep Learning (TensorFlow, Keras, PyTorch)</option>
                </select>
              </FormRow>
              <FormRow label="Description" required>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input"
                />
              </FormRow>
              <FormRow label="Tags (séparés par des virgules)">
                <input
                  value={form.tagsInput}
                  onChange={(e) =>
                    setForm({ ...form, tagsInput: e.target.value })
                  }
                  className="input"
                  placeholder="React, TypeScript, Tailwind"
                />
              </FormRow>
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <FormRow label="Lien">
                  <input
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </FormRow>
                <FormRow label="Ordre">
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
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
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

'use client'

import { useState } from 'react'
import { Edit3, Loader2, Plus, Trash2, X, ExternalLink, Upload, Image as ImageIcon } from 'lucide-react'
import type { Project } from '@/lib/db'

type FormState = {
  id?: number
  title: string
  category: string
  description: string
  tagsInput: string
  link: string
  display_order: string
  image_url: string
}

const emptyForm: FormState = {
  title: '',
  category: '',
  description: '',
  tagsInput: '',
  link: '',
  display_order: '0',
  image_url: '',
}

/**
 * Render a projects management UI that lists projects and provides create, edit, delete, image upload, and reorder functionality.
 *
 * @param initialProjects - Optional initial list of projects used to populate the manager; defaults to an empty array.
 * @returns The React element for the projects management interface.
 */
export default function ProjectsManager({
  initialProjects = [],
}: {
  initialProjects?: Project[]
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageUploadLoading, setImageUploadLoading] = useState(false)

  function openCreate() {
    setForm(emptyForm)
    setImagePreview('')
    setMode('create')
    setError('')
    setOpen(true)
  }

  function openEdit(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      category: p.category,
      description: p.description,
      tagsInput: (p.tags ?? []).join(', '),
      link: p.link ?? '',
      display_order: String(p.display_order ?? 0),
      image_url: p.image_url ?? '',
    })
    setImagePreview(p.image_url ?? '')
    setMode('edit')
    setError('')
    setOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploadLoading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setImagePreview(base64)
        setForm({ ...form, image_url: base64 })
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Error uploading image')
    } finally {
      setImageUploadLoading(false)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        link: form.link,
        image_url: form.image_url,
        display_order: Number(form.display_order) || 0,
        tags: form.tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }
      const url = mode === 'create' ? '/api/projects' : `/api/projects/${form.id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      if (mode === 'create') {
        setProjects((prev) => [data.project || data, ...prev])
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === (data.project?.id || data.id) ? (data.project || data) : p))
        )
      }
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition duration-200"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          New Project
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700 bg-slate-700/50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Category</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Tags</th>
              <th className="px-4 py-3 font-medium text-right">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No projects yet
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{p.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {p.description}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-400 md:table-cell">
                    {p.category}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(p.tags ?? []).slice(0, 3).map((t) => (
                        <span key={t} className="inline-block rounded bg-blue-600/30 px-2 py-1 text-xs text-blue-300">
                          {t}
                        </span>
                      ))}
                      {(p.tags ?? []).length > 3 ? (
                        <span className="text-xs text-slate-500">
                          +{(p.tags ?? []).length - 3}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">
                    {p.display_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.link ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-600 bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                          title="Open link"
                        >
                          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </a>
                      ) : null}
                      <button
                        onClick={() => openEdit(p)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-600 bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-600 bg-slate-700 text-red-400 hover:bg-red-600/20 transition"
                        title="Delete"
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

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="mt-8 w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                {mode === 'create' ? 'New Project' : 'Edit Project'}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4 px-6 py-5">
              {/* Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Project Image
                </label>
                <div className="flex gap-4">
                  {imagePreview && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-600 bg-slate-700">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                      {imageUploadLoading ? (
                        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="text-sm text-slate-400">Click to upload image</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploadLoading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <FormRow label="Title" required>
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
              <FormRow label="Category" required>
                <input
                  required
                  maxLength={100}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input"
                  placeholder="Ex: Data Science"
                />
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
              <FormRow label="Tags (comma separated)">
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
                <FormRow label="Link">
                  <input
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </FormRow>
                <FormRow label="Order">
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
                <div className="rounded-lg border border-red-700 bg-red-900/20 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                  ) : null}
                  {mode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Renders a labeled form row with an optional required indicator and field content.
 *
 * @param label - The label text shown above the field
 * @param required - When true, appends a red `*` after the label to indicate the field is required
 * @param children - The form control(s) or content displayed beneath the label
 * @returns The form row element containing the label and children
 */
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
      <label className="text-xs uppercase tracking-wider text-slate-400">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

const styles = `
  .input {
    width: 100%;
    border-radius: 6px;
    border: 1px solid rgb(71, 85, 105);
    background: rgb(31, 41, 55);
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    color: white;
    outline: none;
    transition: border-color 0.15s;
  }
  .input:focus {
    border-color: rgb(59, 130, 246);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = styles
  document.head.appendChild(style)
}

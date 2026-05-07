'use client'

import { useState } from 'react'
import { Edit3, Loader2, Plus, Trash2, X, ExternalLink, Award } from 'lucide-react'
import type { Certificate } from '@/lib/db'

const DOMAINS = [
  'Ingénieur Logiciel Généraliste',
  'Développeur Logiciel Full Stack IBM',
  'DevOps et Ingénierie Logiciel IBM',
  'Data Scientist IBM',
  'Data Analyst Meta',
  'Deep Learning et TensorFlow',
  'Apprentissage Automatique avec Python',
  'Application avec Python',
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
  title: '',
  issuer: '',
  domain: DOMAINS[0],
  date_obtained: new Date().toISOString().split('T')[0],
  certificate_url: '',
  image_url: '',
  badge_url: '',
  display_order: '0',
}

export default function CertificatesManager({
  initialCertificates = [],
}: {
  initialCertificates?: Certificate[]
} = {}) {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openCreate() {
    setForm(emptyForm)
    setMode('create')
    setError('')
    setOpen(true)
  }

  function openEdit(cert: Certificate) {
    setForm({
      id: cert.id,
      title: cert.title,
      issuer: cert.issuer,
      domain: cert.domain,
      date_obtained: cert.date_obtained.split('T')[0],
      certificate_url: cert.certificate_url ?? '',
      image_url: cert.image_url ?? '',
      badge_url: cert.badge_url ?? '',
      display_order: String(cert.display_order ?? 0),
    })
    setMode('edit')
    setError('')
    setOpen(true)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
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
      const url = mode === 'create' ? '/api/certificates' : `/api/certificates/${form.id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      if (mode === 'create') {
        setCertificates((prev) => [data, ...prev])
      } else {
        setCertificates((prev) => prev.map((c) => (c.id === data.id ? data : c)))
      }
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this certificate?')) return
    const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCertificates((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const certificatesByDomain = DOMAINS.reduce((acc, domain) => {
    acc[domain] = certificates.filter((c) => c.domain === domain)
    return acc
  }, {} as Record<string, Certificate[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition duration-200"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          New Certificate
        </button>
      </div>

      {/* Certificates by Domain */}
      {Object.entries(certificatesByDomain).map(([domain, certs]) => (
        <div key={domain} className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
          <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-white">{domain}</h3>
              <span className="ml-auto text-sm text-slate-400">{certs.length} item{certs.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          {certs.length === 0 ? (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">No certificates in this domain</div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700 bg-slate-800/50">
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Issuer</th>
                    <th className="px-4 py-3 font-medium text-right">Order</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map((cert) => (
                    <tr key={cert.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{cert.title}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {new Date(cert.date_obtained).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">
                        {cert.issuer}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-400">
                        {cert.display_order}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {cert.certificate_url ? (
                            <a
                              href={cert.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-600 bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                              title="Open certificate"
                            >
                              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </a>
                          ) : null}
                          <button
                            onClick={() => openEdit(cert)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-600 bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => remove(cert.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-600 bg-slate-700 text-red-400 hover:bg-red-600/20 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="mt-8 w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                {mode === 'create' ? 'New Certificate' : 'Edit Certificate'}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4 px-6 py-5">
              <FormRow label="Title" required>
                <input
                  required
                  maxLength={255}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input"
                />
              </FormRow>

              <div className="grid grid-cols-2 gap-3">
                <FormRow label="Issuer" required>
                  <input
                    required
                    maxLength={255}
                    value={form.issuer}
                    onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    className="input"
                    placeholder="Ex: IBM, Meta, Coursera"
                  />
                </FormRow>
                <FormRow label="Domain" required>
                  <select
                    required
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
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
                <FormRow label="Date Obtained" required>
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
                <FormRow label="Display Order">
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

              <FormRow label="Certificate URL">
                <input
                  value={form.certificate_url}
                  onChange={(e) =>
                    setForm({ ...form, certificate_url: e.target.value })
                  }
                  className="input"
                  placeholder="https://example.com/verify/123"
                />
              </FormRow>

              <FormRow label="Image URL">
                <input
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  className="input"
                  placeholder="https://example.com/certificates/cert.jpg"
                />
              </FormRow>

              <FormRow label="Badge URL">
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
  select.input option {
    background-color: rgb(31, 41, 55);
    color: white;
  }
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = styles
  document.head.appendChild(style)
}

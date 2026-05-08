"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Portal() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      setError('Mot de passe invalide')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Portail administrateur</h1>
        <p className="mt-2 text-sm text-muted-foreground">Accès strictement restreint.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Mot de passe admin" required />
          <button className="w-full rounded bg-foreground px-4 py-2 text-background">Se connecter</button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  )
}
export default function Portal(){return <main className="min-h-screen grid place-items-center bg-background p-6"><div className="max-w-md rounded-xl border bg-card p-6 text-center"><h1 className="text-xl font-semibold">Accès restreint</h1><p className="mt-2 text-sm text-muted-foreground">Portail réservé à l'administrateur uniquement.</p><Link href="/admin" className="mt-4 inline-block rounded bg-foreground px-4 py-2 text-background">Continuer</Link></div></main>}

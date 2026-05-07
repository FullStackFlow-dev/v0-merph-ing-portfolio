"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const DEFAULT_PASSWORD = "Dev!2026"

export default function Portal() {
  const router = useRouter()
  const [pwd, setPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [err, setErr] = useState("")

  const saved = typeof window !== "undefined" ? localStorage.getItem("admin_password") || DEFAULT_PASSWORD : DEFAULT_PASSWORD

  function enter(e: React.FormEvent) {
    e.preventDefault()
    if (pwd === saved) {
      sessionStorage.setItem("admin_auth", "ok")
      router.push("/admin")
      return
    }
    setErr("Mot de passe incorrect")
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!newPwd.trim()) return
    localStorage.setItem("admin_password", newPwd)
    setNewPwd("")
    setErr("Mot de passe modifié")
  }

  return <main className="min-h-screen grid place-items-center p-6"><div className="w-full max-w-md rounded-xl border bg-card p-6">
    <h1 className="text-xl font-semibold">Accès restreint admin</h1>
    <p className="mt-2 text-sm text-muted-foreground">Réservé à l'administrateur.</p>
    <form onSubmit={enter} className="mt-4 space-y-3"><input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Mot de passe"/><button className="w-full rounded bg-foreground px-4 py-2 text-background">Entrer</button></form>
    <form onSubmit={changePassword} className="mt-5 space-y-2 border-t pt-4"><label className="text-sm">Modifier le mot de passe</label><input type="password" value={newPwd} onChange={(e)=>setNewPwd(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Nouveau mot de passe"/><button className="rounded border px-3 py-2">Enregistrer</button></form>
    {err && <p className="mt-3 text-sm">{err}</p>}
  </div></main>
}

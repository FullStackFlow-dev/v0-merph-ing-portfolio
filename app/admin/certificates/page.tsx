import { AdminNav } from "@/components/admin/admin-nav"

export default function Page() {
  return <div className="min-h-screen bg-background"><AdminNav /><div className="mx-auto max-w-4xl p-8">
    <h1 className="text-2xl font-semibold">Gestion des certificats et diplômes</h1>
    <form className="mt-6 grid gap-4 rounded-lg border bg-card p-6">
      <input className="rounded border px-3 py-2" placeholder="Titre du certificat / diplôme" />
      <input className="rounded border px-3 py-2" placeholder="Organisation / école" />
      <input className="rounded border px-3 py-2" placeholder="Lien du certificat (URL)" />
      <input type="file" accept="application/pdf" className="rounded border px-3 py-2" />
      <button className="rounded bg-foreground px-4 py-2 text-background">Enregistrer</button>
    </form>
  </div></div>
}

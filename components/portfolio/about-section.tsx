export function AboutSection() {
  return (
    <section className="card-lit glow-indigo rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">À propos de mon parcours</h3>
      <p className="mt-2 text-sm text-muted-foreground">Je développe des produits data, web et mobile en combinant architecture logicielle, intelligence artificielle et livraison orientée impact.</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Ingénieur logiciel généraliste: Front-end, Back-end, Data Engineering, Mobile (iOS/Android).</li>
        <li>Parcours professionnel: Full Stack IBM, Data Scientist IBM, Data Analyst Meta, DevOps & ingénierie logicielle IBM.</li>
        <li>Stack clé: TensorFlow, Keras, PyTorch, Next.js, Node.js, PostgreSQL, Docker/Kubernetes.</li>
      </ul>
      <div className="mt-4 rounded-md border border-border bg-background p-4 text-sm">
        <p><strong>Académie</strong></p>
        <p>Licence en Administration et Gestion des Entreprises (obtenue).</p>
        <p>Master MIAGE 1 (2027–2028) en cours.</p>
        <p>Master MIAGE 2 (2028) en cours.</p>
      </div>
    </section>
  )
}

import { sql } from "@/lib/db"
import type { Certificate } from "@/lib/db"

const DOMAIN_ORDER = [
  "Ingénieur logiciel généraliste",
  "Développeur logiciel Full Stack IBM",
  "DevOps et ingénierie logiciel IBM",
  "Data Scientist IBM",
  "Data Analyst Meta",
  "Deep Learning et TensorFlow",
  "Apprentissage automatique avec Python",
  "Apprentissage supervisé et non supervisé"
]

export default async function CertificatesPage() {
  try {
    const certificates = await sql<Certificate[]>(
      `SELECT * FROM certificates ORDER BY display_order ASC, date_obtained DESC`
    )

    // Organize by domain
    const certsByDomain = certificates.reduce((acc: Record<string, Certificate[]>, cert) => {
      if (!acc[cert.domain]) acc[cert.domain] = []
      acc[cert.domain].push(cert)
      return acc
    }, {})

    // Sort domains according to DOMAIN_ORDER
    const sortedDomains = DOMAIN_ORDER.filter((domain) => certsByDomain[domain])

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
              Mes Certificats
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-2">
              Domaines d'expertise et certifications professionnelles
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Certificates by Domain */}
          <div className="space-y-16">
            {sortedDomains.map((domain) => (
              <section key={domain} className="mb-16 last:mb-0">
                <div className="mb-8">
                  <h2 className="text-3xl font-semibold text-blue-300 mb-2 flex items-center">
                    <span className="inline-block w-1 h-8 bg-gradient-to-b from-blue-400 to-green-400 mr-3 rounded-full"></span>
                    {domain}
                  </h2>
                  <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent w-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certsByDomain[domain].map((cert) => (
                    <div
                      key={cert.id}
                      className="group relative h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                    >
                      {/* Image Container */}
                      {cert.image_url && (
                        <div className="relative h-48 overflow-hidden bg-slate-600">
                          <img
                            src={cert.image_url}
                            alt={cert.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>
                      )}

                      {/* Content Container */}
                      <div className={`p-5 flex flex-col h-full ${cert.image_url ? "" : "min-h-48 justify-center"}`}>
                        <h3 className="font-semibold text-white mb-3 text-lg leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
                          {cert.title}
                        </h3>

                        <div className="flex-grow space-y-2 mb-4">
                          <p className="text-slate-300 text-sm font-medium">{cert.issuer}</p>
                          {cert.date_obtained && (
                            <p className="text-slate-400 text-xs">
                              {new Date(cert.date_obtained).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </p>
                          )}
                        </div>

                        {/* Certificate Link */}
                        {cert.certificate_url && (
                          <a
                            href={cert.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-semibold group/link transition-colors"
                          >
                            <span>Voir le certificat</span>
                            <span className="ml-1 transform group-hover/link:translate-x-1 transition-transform">→</span>
                          </a>
                        )}
                      </div>

                      {/* Accent Border */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Empty State */}
          {sortedDomains.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">Aucun certificat disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Erreur</h1>
          <p className="text-slate-300">Impossible de charger les certificats. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    )
  }
}

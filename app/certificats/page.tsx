'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Award } from 'lucide-react'

interface Certificate {
  id: string
  title: string
  issuer: string
  domain: string
  date_obtained: string
  certificate_url?: string
  image_url?: string
  badge_url?: string
  display_order: number
}

const DOMAIN_ORDER = [
  'Ingénieur Logiciel Généraliste',
  'Développeur Logiciel Full Stack IBM',
  'DevOps et Ingénierie Logiciel IBM',
  'Data Scientist IBM',
  'Data Analyst Meta',
  'Deep Learning et TensorFlow',
  'Apprentissage Automatique avec Python',
  'Application avec Python'
]

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  'Ingénieur Logiciel Généraliste': 'Fondamentaux en backend, frontend, base de données et mobile',
  'Développeur Logiciel Full Stack IBM': 'Développement d\'applications complètes avec IBM',
  'DevOps et Ingénierie Logiciel IBM': 'Infrastructure, déploiement et pratiques DevOps',
  'Data Scientist IBM': 'Data Science et machine learning avancé',
  'Data Analyst Meta': 'Analyse de données et insights avec Meta',
  'Deep Learning et TensorFlow': 'Réseaux de neurones et frameworks de deep learning',
  'Apprentissage Automatique avec Python': 'Algorithmes ML et Python avancé',
  'Application avec Python': 'Développement d\'applications supervisées et non supervisées'
}

/**
 * Render the certificates listing page: fetches certificates, groups and sorts them by domain, and displays loading, error, or empty states, per-domain certificate grids, and footer summary stats.
 *
 * @returns The page's JSX element that renders the certificates UI.
 */
export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Fetch from Supabase
        const response = await fetch('/api/certificates')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des certificats')
        }
        const data = await response.json()
        setCertificates(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        console.error('Error fetching certificates:', err)
        setError('Impossible de charger les certificats')
        // Set fallback empty array
        setCertificates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  // Organize by domain
  const certsByDomain = certificates.reduce((acc: Record<string, Certificate[]>, cert) => {
    const domain = cert.domain || 'Autre'
    if (!acc[domain]) acc[domain] = []
    acc[domain].push(cert)
    return acc
  }, {})

  // Sort domains according to DOMAIN_ORDER
  const sortedDomains = DOMAIN_ORDER.filter((domain) => certsByDomain[domain])

  // Sort certificates within each domain by display_order and date
  Object.keys(certsByDomain).forEach((domain) => {
    certsByDomain[domain].sort((a, b) => {
      if (a.display_order !== b.display_order) {
        return a.display_order - b.display_order
      }
      return new Date(b.date_obtained).getTime() - new Date(a.date_obtained).getTime()
    })
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Award className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
            Mes Certifications
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 mb-4 max-w-3xl mx-auto">
            Domaines d'expertise et certifications professionnelles validant mon expérience en développement logiciel, data science et ingénierie cloud.
          </p>
          
          <div className="flex justify-center gap-2">
            <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"></div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-slate-400 mt-4">Chargement des certificats...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : sortedDomains.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Aucun certificat disponible pour le moment.</p>
          </div>
        ) : (
          /* Certificates by Domain */
          <div className="space-y-20">
            {sortedDomains.map((domain, domainIndex) => (
              <section key={domain} className="scroll-mt-20">
                {/* Domain Header */}
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-white">
                        {domain}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        {DOMAIN_DESCRIPTIONS[domain]}
                      </p>
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/30 to-transparent mt-6"></div>
                </div>

                {/* Certificate Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certsByDomain[domain].map((cert) => (
                    <CertificateCard key={cert.id} certificate={cert} />
                  ))}
                </div>

                {/* Spacing between sections */}
                {domainIndex < sortedDomains.length - 1 && (
                  <div className="mt-20 pt-20 border-t border-slate-700/50"></div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {certificates.length > 0 && (
          <div className="mt-24 pt-16 border-t border-slate-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">{certificates.length}</div>
                <p className="text-slate-400 text-sm mt-2">Certificats</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{sortedDomains.length}</div>
                <p className="text-slate-400 text-sm mt-2">Domaines</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">
                  {certificates.filter(c => c.certificate_url).length}
                </div>
                <p className="text-slate-400 text-sm mt-2">Vérifiables</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">
                  {certificates.filter(c => c.image_url || c.badge_url).length}
                </div>
                <p className="text-slate-400 text-sm mt-2">Avec badges</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface CertificateCardProps {
  certificate: Certificate
}

/**
 * Render a certificate card showing an image or badge, title, issuer, obtained date, and an optional external link.
 *
 * @param certificate - The certificate object to display; expected to contain fields such as `title`, `issuer`, optional `date_obtained`, `image_url`, `badge_url`, and `certificate_url`.
 * @returns A JSX element representing the styled certificate card.
 */
function CertificateCard({ certificate }: CertificateCardProps) {
  const [imageError, setImageError] = useState(false)

  const hasImage = certificate.image_url && !imageError
  const badgeUrl = certificate.badge_url || certificate.image_url

  return (
    <div className="group relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
      {/* Image Container */}
      {hasImage && (
        <div className="relative h-40 overflow-hidden bg-slate-700">
          <img
            src={certificate.image_url!}
            alt={certificate.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Content Container */}
      <div className={`p-6 flex flex-col h-full ${hasImage ? '' : 'min-h-64 justify-center'}`}>
        {/* Badge or Icon */}
        {badgeUrl && !hasImage && (
          <div className="mb-4 flex items-center justify-center">
            <div className="h-16 w-16 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600">
              <img
                src={badgeUrl}
                alt={certificate.issuer}
                className="h-12 w-12 object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-white mb-3 text-lg leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
          {certificate.title}
        </h3>

        {/* Issuer and Date */}
        <div className="flex-grow space-y-2 mb-6">
          <p className="text-slate-300 text-sm font-medium flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            {certificate.issuer}
          </p>
          {certificate.date_obtained && (
            <p className="text-slate-400 text-xs">
              {new Date(certificate.date_obtained).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Certificate Link */}
        {certificate.certificate_url && (
          <a
            href={certificate.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold group/link transition-colors"
          >
            <span>Voir le certificat</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
          </a>
        )}
      </div>

      {/* Accent Border on Hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

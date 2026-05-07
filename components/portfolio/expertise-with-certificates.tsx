'use client'

import { useState, useEffect } from 'react'
import { Award, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Certificate {
  id: string
  title: string
  domain: string
  issuer: string
  certificate_url: string | null
}

const DOMAINS = [
  'Ingénieur logiciel généraliste',
  'Développeur logiciel Full Stack IBM',
  'DevOps et ingénierie logiciel IBM',
  'Data Scientist IBM',
  'Data Analyst Meta',
  'Deep Learning et TensorFlow',
  'Apprentissage automatique avec Python',
  'Apprentissage supervisé et non supervisé',
]

export default function ExpertiseWithCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response = await fetch('/api/certificates')
        const data = await response.json()
        setCertificates(data || [])
      } catch (error) {
        console.error('Failed to load certificates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  const getCertificatesByDomain = (domain: string) => {
    return certificates.filter(cert => cert.domain === domain)
  }

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Domaines d'expertise</h2>
        <p className="text-slate-400 mb-12">Cliquez sur un domaine pour voir les certificats associés</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAINS.map(domain => {
            const domainCerts = getCertificatesByDomain(domain)
            const count = domainCerts.length
            const isExpanded = expandedDomain === domain

            return (
              <div key={domain} className="group">
                {/* Domain Card */}
                <button
                  onClick={() => setExpandedDomain(isExpanded ? null : domain)}
                  className="w-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white text-left">{domain}</h3>
                    {count > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {count}
                      </span>
                    )}
                  </div>
                  {count === 0 && (
                    <p className="text-slate-500 text-sm">Pas de certificat encore</p>
                  )}
                </button>

                {/* Expanded Certificates */}
                {isExpanded && count > 0 && (
                  <div className="mt-4 bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    {domainCerts.map(cert => (
                      <div key={cert.id} className="flex items-start gap-3 pb-3 border-b border-slate-700 last:border-b-0">
                        <Award className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{cert.title}</p>
                          <p className="text-slate-400 text-xs">{cert.issuer}</p>
                          {cert.certificate_url && (
                            <a
                              href={cert.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 mt-2"
                            >
                              Voir le certificat <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Link to full certificates page */}
        <div className="mt-12 text-center">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Voir tous les certificats
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

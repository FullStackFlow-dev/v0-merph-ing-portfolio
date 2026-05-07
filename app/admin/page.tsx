'use client'

import { useState, useEffect } from 'react'
import { LogOut, LayoutDashboard, Zap } from 'lucide-react'
import AdminAuth from '@/components/admin/admin-auth'
import ProjectsManager from '@/components/admin/projects-manager'
import MessagesManager from '@/components/admin/messages-manager'
import CertificatesManager from '@/components/admin/certificates-manager'

interface Project {
  id: number
  title: string
  category: string
  description: string
  tags: string[]
  link: string | null
  image_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

interface Certificate {
  id: number
  title: string
  issuer: string
  domain: string
  date_obtained: string
  certificate_url: string | null
  image_url: string | null
  badge_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'certificates'>('projects')
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])

  useEffect(() => {
    // Check for existing session token
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)

    // Fetch initial data if authenticated
    if (token) {
      fetchProjects()
      fetchCertificates()
    }
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : data.projects || [])
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    }
  }

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (response.ok) {
        const data = await response.json()
        setCertificates(Array.isArray(data) ? data : data.certificates || [])
      }
    } catch (err) {
      console.error('Failed to fetch certificates:', err)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken')
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setProjects([])
    setCertificates([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300 flex items-center gap-2">
          <Zap className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={() => setIsAuthenticated(true)} />
  }

  const tabs = [
    { id: 'projects' as const, label: 'Gestion des Projets', icon: '📁' },
    { id: 'messages' as const, label: 'Gestion des Messages', icon: '💬' },
    { id: 'certificates' as const, label: 'Gestion des Certificats', icon: '🎓' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg border border-red-600/50 transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="sticky top-16 z-30 bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium border-b-2 transition duration-200 flex items-center gap-2 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-blue-400'
                    : 'text-slate-400 border-transparent hover:text-slate-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 sm:p-8">
          {/* Tab Content */}
          {activeTab === 'projects' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Gestion des Projets</h2>
                <p className="text-slate-400">Add, edit, and manage your portfolio projects</p>
              </div>
              <ProjectsManager initialProjects={projects} />
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Gestion des Messages</h2>
                <p className="text-slate-400">View and manage contact form submissions</p>
              </div>
              <MessagesManager />
            </div>
          )}

          {activeTab === 'certificates' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Gestion des Certificats</h2>
                <p className="text-slate-400">Add, edit, and organize your certificates</p>
              </div>
              <CertificatesManager initialCertificates={certificates} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-500 text-sm">
          <p>Admin Dashboard - All changes are saved in real-time</p>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import AdminAuth from '@/components/admin/admin-auth'
import ProjectsManager from '@/components/admin/projects-manager'
import MessagesManager from '@/components/admin/messages-manager'
import CertificatesManager from '@/components/admin/certificates-manager'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session token
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken')
              setIsAuthenticated(false)
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto flex">
          {[
            { id: 'projects', label: 'Gestion des Projets' },
            { id: 'messages', label: 'Gestion des Messages' },
            { id: 'certificates', label: 'Gestion des Certificats' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium border-b-2 transition duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'messages' && <MessagesManager />}
        {activeTab === 'certificates' && <CertificatesManager />}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Trash2, Mail, Eye, EyeOff } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      setMessages(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des messages')
    } finally {
      setLoading(false)
    }
  }

  const toggleRead = async (id: string, isRead: boolean) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !isRead }),
      })
      loadMessages()
    } catch (err) {
      setError('Erreur lors de la mise à jour')
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Supprimer ce message?')) return
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      loadMessages()
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    read: messages.filter(m => m.is_read).length,
  }

  if (loading) return <div className="text-slate-400">Chargement...</div>

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Non lus</p>
          <p className="text-3xl font-bold text-blue-400">{stats.unread}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Lus</p>
          <p className="text-3xl font-bold text-green-400">{stats.read}</p>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3"><p className="text-red-400">{error}</p></div>}

      {/* Messages List */}
      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucun message</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`border border-slate-700 rounded-lg p-4 cursor-pointer transition ${msg.is_read ? 'bg-slate-800' : 'bg-slate-700 border-blue-600'}`} onClick={() => setSelectedMessage(msg)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">{msg.name}</h3>
                    {!msg.is_read && <span className="bg-blue-600 rounded-full w-2 h-2"></span>}
                  </div>
                  <p className="text-slate-400 text-sm">{msg.email}</p>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{msg.message}</p>
                  <p className="text-slate-600 text-xs mt-2">{new Date(msg.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); toggleRead(msg.id, msg.is_read) }} className="bg-slate-700 hover:bg-slate-600 p-2 rounded">
                    {msg.is_read ? <Eye className="w-4 h-4 text-slate-400" /> : <EyeOff className="w-4 h-4 text-blue-400" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id) }} className="bg-red-900/30 hover:bg-red-900 p-2 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-white mb-4">{selectedMessage.name}</h2>
            <p className="text-slate-400 mb-4">{selectedMessage.email}</p>
            <div className="bg-slate-700 rounded p-4 mb-4">
              <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <p className="text-slate-500 text-sm mb-4">{new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</p>
            <button onClick={() => setSelectedMessage(null)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}

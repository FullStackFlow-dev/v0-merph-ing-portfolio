'use client'

import { useState, useEffect } from 'react'
import { Trash2, Mail, Eye, EyeOff, X, Calendar, User } from 'lucide-react'

interface Message {
  id: string | number
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
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    loadMessages()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadMessages, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(Array.isArray(data) ? data : data.messages || [])
      }
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const toggleRead = async (id: string | number, isRead: boolean) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !isRead }),
      })
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: !isRead })
      }
      loadMessages()
    } catch (err) {
      setError('Error updating message')
    }
  }

  const deleteMessage = async (id: string | number) => {
    if (!confirm('Delete this message?')) return
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      loadMessages()
    } catch (err) {
      setError('Error deleting message')
    }
  }

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    read: messages.filter(m => m.is_read).length,
  }

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read') return m.is_read
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total"
          value={stats.total}
          color="blue"
        />
        <StatCard
          label="Unread"
          value={stats.unread}
          color="yellow"
        />
        <StatCard
          label="Read"
          value={stats.read}
          color="green"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-slate-700 bg-slate-800/50">
            <Mail className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400">
              {messages.length === 0 ? 'No messages yet' : 'No messages match the filter'}
            </p>
          </div>
        ) : (
          filteredMessages.map(msg => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                msg.is_read
                  ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                  : 'border-blue-600 bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <h3 className="font-semibold text-white truncate">{msg.name}</h3>
                    {!msg.is_read && (
                      <span className="flex-shrink-0 ml-auto inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm truncate">{msg.email}</p>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{msg.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-slate-600 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleRead(msg.id, msg.is_read)
                    }}
                    className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition"
                    title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {msg.is_read ? (
                      <Eye className="w-4 h-4 text-slate-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-blue-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMessage(msg.id)
                    }}
                    className="bg-red-900/30 hover:bg-red-900/50 p-2 rounded-lg transition"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <p className="text-white whitespace-pre-wrap break-words">{selectedMessage.message}</p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm">
                {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                backgroundColor: selectedMessage.is_read ? 'rgb(16, 185, 129, 0.1)' : 'rgb(59, 130, 246, 0.1)',
                color: selectedMessage.is_read ? 'rgb(16, 185, 129)' : 'rgb(59, 130, 246)',
              }}>
                {selectedMessage.is_read ? 'Read' : 'Unread'}
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-700 pt-6">
              <button
                onClick={() =>
                  toggleRead(selectedMessage.id, selectedMessage.is_read)
                }
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                {selectedMessage.is_read ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Mark as Unread
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Mark as Read
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  deleteMessage(selectedMessage.id)
                  setSelectedMessage(null)
                }}
                className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'blue' | 'yellow' | 'green' }) {
  const colorMap = {
    blue: { bg: 'bg-blue-900/20', border: 'border-blue-700', text: 'text-blue-400', value: 'text-blue-300' },
    yellow: { bg: 'bg-yellow-900/20', border: 'border-yellow-700', text: 'text-yellow-400', value: 'text-yellow-300' },
    green: { bg: 'bg-green-900/20', border: 'border-green-700', text: 'text-green-400', value: 'text-green-300' },
  }
  const colors = colorMap[color]
  
  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <p className={`${colors.text} text-sm font-medium mb-1`}>{label}</p>
      <p className={`text-3xl font-bold ${colors.value}`}>{value}</p>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Plus,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit2,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Sidebar({ currentChatId, onChatSelect, onNewChat }) {
  const navigate = useNavigate()
  const { user, logout, token } = useAuth()
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [editingChat, setEditingChat] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [menuOpen, setMenuOpen] = useState(null)

  useEffect(() => {
    fetchChats()
  }, [token])

  const fetchChats = async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChats(data.chats || [])
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setChats((prev) => prev.filter((c) => c._id !== chatId))
        if (currentChatId === chatId) {
          onNewChat()
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
    setMenuOpen(null)
  }

  const handleUpdateTitle = async (chatId) => {
    if (!editTitle.trim()) {
      setEditingChat(null)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      })

      if (response.ok) {
        setChats((prev) =>
          prev.map((c) => (c._id === chatId ? { ...c, title: editTitle.trim() } : c))
        )
      }
    } catch (error) {
      console.error('Failed to update title:', error)
    }
    setEditingChat(null)
    setMenuOpen(null)
  }

  const startEditing = (chat) => {
    setEditingChat(chat._id)
    setEditTitle(chat.title)
    setMenuOpen(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (diff < 86400000) {
      // Less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diff < 604800000) {
      // Less than 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <button onClick={onNewChat} className="new-chat-btn">
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span>New chat</span>}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapse-btn"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Chat List */}
        <div className="sidebar-content">
          {isLoading ? (
            <div className="sidebar-loading">
              <div className="spinner" />
            </div>
          ) : chats.length === 0 ? (
            <div className="sidebar-empty">
              {!isCollapsed && (
                <>
                  <MessageSquare className="w-12 h-12" />
                  <p>No conversations yet</p>
                </>
              )}
            </div>
          ) : (
            <div className="chat-list">
              {!isCollapsed && <div className="chat-list-header">Recent</div>}
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`chat-item ${currentChatId === chat._id ? 'active' : ''}`}
                  onClick={() => onChatSelect(chat._id)}
                >
                  <MessageSquare className="w-4 h-4 chat-icon" />
                  {!isCollapsed && (
                    <>
                      {editingChat === chat._id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleUpdateTitle(chat._id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateTitle(chat._id)
                            if (e.key === 'Escape') setEditingChat(null)
                          }}
                          className="chat-title-input"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="chat-title">{chat.title}</span>
                      )}
                      <span className="chat-date">{formatDate(chat.updatedAt)}</span>
                      <button
                        className="chat-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpen(menuOpen === chat._id ? null : chat._id)
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpen === chat._id && (
                        <div className="chat-menu">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(chat)
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChat(chat._id)
                            }}
                            className="danger"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {!isCollapsed && user && (
            <div className="user-info">
              <div className="user-avatar">
                <User className="w-5 h-5" />
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
          )}
          <div className="sidebar-actions">
            <button className="action-btn" title="Settings">
              <Settings className="w-5 h-5" />
              {!isCollapsed && <span>Settings</span>}
            </button>
            <button onClick={handleLogout} className="action-btn" title="Log out">
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(null)} />
      )}

      <style>{`
        .sidebar {
          width: 280px;
          height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          z-index: 100;
        }

        .sidebar.collapsed {
          width: 64px;
        }

        .sidebar-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border);
        }

        .new-chat-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .new-chat-btn:hover {
          background: var(--accent);
          opacity: 0.9;
        }

        .sidebar.collapsed .new-chat-btn {
          flex: none;
          width: 40px;
          height: 40px;
          padding: 0;
        }

        .collapse-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .collapse-btn:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
        }

        .sidebar.collapsed .collapse-btn {
          display: none;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .sidebar-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .sidebar-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: var(--text-muted);
          gap: 12px;
        }

        .sidebar-empty p {
          font-size: 14px;
        }

        .chat-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chat-list-header {
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .chat-item:hover {
          background: var(--bg-tertiary);
        }

        .chat-item.active {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-strong);
        }

        .chat-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .chat-title {
          flex: 1;
          font-size: 14px;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-title-input {
          flex: 1;
          padding: 4px 8px;
          border: 1px solid var(--accent);
          border-radius: 6px;
          font-size: 14px;
          background: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
        }

        .chat-date {
          font-size: 12px;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .chat-menu-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          border-radius: 6px;
          color: var(--text-muted);
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s;
        }

        .chat-item:hover .chat-menu-btn {
          opacity: 1;
        }

        .chat-menu-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .chat-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: var(--shadow-lg);
          padding: 6px;
          z-index: 1000;
          min-width: 140px;
        }

        .chat-menu button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: none;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-primary);
          cursor: pointer;
          transition: background 0.2s;
        }

        .chat-menu button:hover {
          background: var(--bg-tertiary);
        }

        .chat-menu button.danger {
          color: #ef4444;
        }

        .chat-menu button.danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
        }

        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 10px;
          margin-bottom: 4px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: var(--accent-gradient);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 12px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: none;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .action-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .sidebar.collapsed .action-btn {
          justify-content: center;
          padding: 10px;
        }

        .sidebar.collapsed .action-btn span {
          display: none;
        }
      `}</style>
    </>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function WorkspaceSetup({ onCreated }) {
  const [tab, setTab] = useState('create')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  const create = async () => {
    if (!name.trim()) return
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/workspaces', { name })
      onCreated(data)
    } catch { setError('Failed to create workspace') }
    finally { setLoading(false) }
  }

  const join = async () => {
    if (!code.trim()) return
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/workspaces/join', { inviteCode: code })
      onCreated(data)
    } catch { setError('Invalid invite code') }
    finally { setLoading(false) }
  }

  return (
    <div style={s.root}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>
          <span style={s.logoDot} />
          NexFlow
        </div>

        <h1 style={s.heading}>Get started</h1>
        <p style={s.sub}>Create a new workspace or join an existing one.</p>

        {/* Tabs */}
        <div style={s.tabs}>
          {['create', 'join'].map(t => (
            <button
              key={t}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
              onClick={() => { setTab(t); setError('') }}
            >
              {t === 'create' ? 'Create' : 'Join'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={s.errorBox}>
            <span style={s.errorIcon}>!</span>
            {error}
          </div>
        )}

        {/* Form */}
        {tab === 'create' ? (
          <div style={s.form}>
            <label style={s.label}>Workspace name</label>
            <input
              style={s.input}
              placeholder="e.g. Acme Team"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && create()}
              autoFocus
            />
            <button
              style={{ ...s.btn, ...(loading || !name.trim() ? s.btnDisabled : {}) }}
              onClick={create}
              disabled={loading || !name.trim()}
            >
              {loading ? 'Creating…' : 'Create workspace →'}
            </button>
          </div>
        ) : (
          <div style={s.form}>
            <label style={s.label}>Invite code</label>
            <input
              style={{ ...s.input, fontFamily: 'monospace' }}
              placeholder="Paste invite code"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && join()}
              autoFocus
            />
            <button
              style={{ ...s.btn, ...(loading || !code.trim() ? s.btnDisabled : {}) }}
              onClick={join}
              disabled={loading || !code.trim()}
            >
              {loading ? 'Joining…' : 'Join workspace →'}
            </button>
          </div>
        )}

        {/* Sign out */}
        <button
          style={s.signOut}
          onClick={() => { logout(); navigate('/') }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

const s = {
  root: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f9fafb', padding: 24,
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: 14, padding: '36px 36px 28px',
    width: '100%', maxWidth: 400,
  },

  logo: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em',
    color: '#111', marginBottom: 28,
  },
  logoDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#111', flexShrink: 0,
  },

  heading: {
    fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
    color: '#0a0a0a', margin: '0 0 6px',
  },
  sub: {
    fontSize: 14, color: '#6b7280', margin: '0 0 24px',
  },

  tabs: {
    display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 20,
  },
  tab: {
    flex: 1, padding: '9px 0',
    background: 'none', border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer', fontSize: 13, fontWeight: 500,
    color: '#9ca3af', fontFamily: 'inherit',
    marginBottom: -1, transition: 'color 0.15s, border-color 0.15s',
  },
  tabActive: {
    borderBottomColor: '#111', color: '#111',
  },

  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 7, padding: '8px 12px',
    fontSize: 13, color: '#b91c1c', marginBottom: 14,
  },
  errorIcon: {
    width: 16, height: 16, borderRadius: '50%',
    background: '#fee2e2', border: '1px solid #fca5a5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700, color: '#dc2626', flexShrink: 0,
  },

  form: {
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  label: {
    fontSize: 12, fontWeight: 600, color: '#374151',
  },
  input: {
    height: 40, padding: '0 12px',
    border: '1.5px solid #e5e7eb', borderRadius: 7,
    fontSize: 14, color: '#111', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
    background: '#fff', width: '100%',
  },
  btn: {
    height: 40, background: '#111', color: '#fff',
    border: 'none', borderRadius: 7,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', marginTop: 4,
    transition: 'opacity 0.15s',
  },
  btnDisabled: {
    opacity: 0.45, cursor: 'not-allowed',
  },

  signOut: {
    display: 'block', margin: '20px auto 0',
    background: 'none', border: 'none',
    fontSize: 12, color: '#9ca3af',
    cursor: 'pointer', fontFamily: 'inherit',
  },
}

import { useState } from 'react'
import api from '../api'

export default function Sidebar({
  workspaces, activeWorkspace, setActiveWorkspace,
  channels, activeChannel, setActiveChannel,
  activeView, setActiveView,
  onlineUsers, user,
  onChannelCreated, onWorkspaceCreated, onLogout
}) {
  const [showNewChannel, setShowNewChannel] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [showNewWorkspace, setShowNewWorkspace] = useState(false)
  const [newWsName, setNewWsName] = useState('')

  const createChannel = async () => {
    if (!newChannelName.trim()) return
    const { data } = await api.post('/channels', {
      name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
      workspaceId: activeWorkspace._id
    })
    onChannelCreated(data)
    setNewChannelName('')
    setShowNewChannel(false)
  }

  const joinWorkspace = async () => {
    if (!joinCode.trim()) return
    try {
      const { data } = await api.post('/workspaces/join', { inviteCode: joinCode })
      onWorkspaceCreated(data)
      setJoinCode('')
      setShowInvite(false)
    } catch { alert('Invalid invite code') }
  }

  const createWorkspace = async () => {
    if (!newWsName.trim()) return
    const { data } = await api.post('/workspaces', { name: newWsName })
    onWorkspaceCreated(data)
    setNewWsName('')
    setShowNewWorkspace(false)
  }

  const onlineCount = Object.keys(onlineUsers).length

  return (
    <aside style={s.sidebar}>

      {/* Workspace header */}
      <div style={s.wsHeader}>
        <div style={s.wsNameRow}>
          <div style={s.wsAvatar}>
            {activeWorkspace?.name?.[0]?.toUpperCase()}
          </div>
          <span style={s.wsName}>{activeWorkspace?.name}</span>
        </div>
        <button style={s.iconBtn} onClick={() => setShowNewWorkspace(true)} title="New workspace">
          <PlusIcon />
        </button>
      </div>

      {/* Workspace switcher */}
      {workspaces.length > 1 && (
        <div style={s.wsSwitcher}>
          {workspaces.map(ws => (
            <button key={ws._id}
              onClick={() => setActiveWorkspace(ws)}
              style={{
                ...s.wsChip,
                ...(activeWorkspace?._id === ws._id ? s.wsChipActive : {})
              }}>
              {ws.name}
            </button>
          ))}
        </div>
      )}

      {/* Tasks nav button */}
      <div style={s.navSection}>
        <button
          onClick={() => setActiveView('tasks')}
          style={{
            ...s.navBtn,
            ...(activeView === 'tasks' ? s.navBtnActive : {})
          }}>
          <GridIcon />
          Tasks board
        </button>
      </div>

      {/* Channels */}
      <div style={s.channelsSection}>
        <div style={s.sectionHeader}>
          <span style={s.sectionLabel}>CHANNELS</span>
          <button style={s.iconBtn} onClick={() => setShowNewChannel(true)}>
            <PlusIcon size={11} />
          </button>
        </div>

        {showNewChannel && (
          <div style={s.newChannelWrap}>
            <input
              style={s.inlineInput}
              placeholder="channel-name"
              value={newChannelName}
              onChange={e => setNewChannelName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') createChannel()
                if (e.key === 'Escape') setShowNewChannel(false)
              }}
              autoFocus
            />
            <div style={s.inlineActions}>
              <button style={s.inlineCreate} onClick={createChannel}>Create</button>
              <button style={s.inlineCancel} onClick={() => setShowNewChannel(false)}>Cancel</button>
            </div>
          </div>
        )}

        {channels.map(ch => (
          <button key={ch._id}
            onClick={() => setActiveChannel(ch)}
            style={{
              ...s.channelBtn,
              ...(activeChannel?._id === ch._id && activeView === 'chat' ? s.channelBtnActive : {})
            }}>
            <span style={s.hash}>#</span>
            <span style={s.channelName}>{ch.name}</span>
          </button>
        ))}
      </div>

      {/* Online users */}
      <div style={s.onlineSection}>
        <span style={s.sectionLabel}>ONLINE · {onlineCount}</span>
        {Object.entries(onlineUsers).slice(0, 5).map(([id, name]) => (
          <div key={id} style={s.memberRow}>
            <div style={s.memberAvatarWrap}>
              <div style={s.memberAvatar}>{name[0].toUpperCase()}</div>
              <span style={s.onlineDot} />
            </div>
            <span style={s.memberName}>{name}</span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={s.bottomSection}>
        <button onClick={() => setShowInvite(!showInvite)} style={s.inviteBtn}>
          <LinkIcon />
          Invite / Join
        </button>

        {showInvite && (
          <div style={s.invitePanel}>
            <div style={s.inviteCode}>
              Your code: <span style={s.inviteCodeVal}>{activeWorkspace?.inviteCode}</span>
            </div>
            <input
              style={s.inlineInput}
              placeholder="Enter invite code"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && joinWorkspace()}
            />
            <button style={s.inlineCreate} onClick={joinWorkspace}>Join workspace</button>
          </div>
        )}

        <div style={s.userRow}>
          <div style={s.userAvatar}>{user?.username?.[0]?.toUpperCase()}</div>
          <span style={s.userName}>{user?.username}</span>
          <button style={s.logoutBtn} onClick={onLogout}>Sign out</button>
        </div>
      </div>

      {/* New workspace modal */}
      {showNewWorkspace && (
        <div style={s.modalBg} onClick={() => setShowNewWorkspace(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>New workspace</span>
              <button style={s.modalClose} onClick={() => setShowNewWorkspace(false)}>✕</button>
            </div>
            <input
              style={s.modalInput}
              placeholder="Workspace name"
              value={newWsName}
              onChange={e => setNewWsName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createWorkspace()}
              autoFocus
            />
            <div style={s.modalActions}>
              <button style={s.modalPrimary} onClick={createWorkspace}>Create</button>
              <button style={s.modalGhost} onClick={() => setShowNewWorkspace(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

// ── tiny icons ────────────────────────────────────────────────────────────────
const PlusIcon = ({ size = 13 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
)
const GridIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)
const LinkIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" />
  </svg>
)

// ── styles ────────────────────────────────────────────────────────────────────
const s = {
  sidebar: {
    width: 232, flexShrink: 0,
    background: '#0f0f0f',
    display: 'flex', flexDirection: 'column',
    height: '100vh', overflowY: 'auto',
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  },
  wsHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 14px',
    borderBottom: '1px solid #1f2937',
  },
  wsNameRow: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  wsAvatar: {
    width: 24, height: 24, borderRadius: 5,
    background: '#374151',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#f9fafb', flexShrink: 0,
  },
  wsName: {
    fontSize: 13, fontWeight: 600, color: '#f9fafb',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#4b5563', padding: 4, borderRadius: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  wsSwitcher: {
    display: 'flex', gap: 4, flexWrap: 'wrap',
    padding: '8px 14px',
    borderBottom: '1px solid #1f2937',
  },
  wsChip: {
    fontSize: 11, padding: '2px 8px', borderRadius: 10,
    background: 'none', border: '1px solid #374151',
    color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit',
  },
  wsChipActive: {
    background: '#1f2937', borderColor: '#374151', color: '#f9fafb',
  },

  navSection: { padding: '8px 8px', borderBottom: '1px solid #1f2937' },
  navBtn: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
    padding: '7px 10px', borderRadius: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#6b7280', fontSize: 12, fontWeight: 500,
    fontFamily: 'inherit', textAlign: 'left',
  },
  navBtnActive: {
    background: '#1f2937', color: '#f9fafb',
  },

  channelsSection: { flex: 1, padding: '8px', overflowY: 'auto' },
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 8px 4px',
  },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#4b5563',
  },
  newChannelWrap: { padding: '4px 4px 8px' },
  inlineInput: {
    width: '100%', padding: '5px 8px',
    background: '#1f2937', border: '1px solid #374151',
    borderRadius: 5, fontSize: 12, color: '#f9fafb',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    marginBottom: 4,
  },
  inlineActions: { display: 'flex', gap: 8 },
  inlineCreate: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 11, color: '#9ca3af', fontWeight: 600, padding: 0,
    fontFamily: 'inherit',
  },
  inlineCancel: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 11, color: '#4b5563', padding: 0, fontFamily: 'inherit',
  },
  channelBtn: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 10px', borderRadius: 5,
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#6b7280', fontSize: 13, fontFamily: 'inherit', textAlign: 'left',
  },
  channelBtnActive: { background: '#1f2937', color: '#f9fafb' },
  hash: { fontSize: 14, color: '#374151', flexShrink: 0 },
  channelName: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  onlineSection: {
    padding: '8px 12px 8px',
    borderTop: '1px solid #1f2937',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  memberRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' },
  memberAvatarWrap: { position: 'relative', flexShrink: 0 },
  memberAvatar: {
    width: 22, height: 22, borderRadius: '50%',
    background: '#1f2937',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 600, color: '#9ca3af',
  },
  onlineDot: {
    position: 'absolute', bottom: -1, right: -1,
    width: 7, height: 7, borderRadius: '50%',
    background: '#22c55e', border: '1.5px solid #0f0f0f',
  },
  memberName: { fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  bottomSection: {
    padding: '10px 12px',
    borderTop: '1px solid #1f2937',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  inviteBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 12, color: '#4b5563', fontFamily: 'inherit', padding: '2px 0',
  },
  invitePanel: {
    display: 'flex', flexDirection: 'column', gap: 6,
    padding: '8px', background: '#1a1a1a', borderRadius: 6,
  },
  inviteCode: { fontSize: 11, color: '#4b5563' },
  inviteCodeVal: { fontFamily: 'monospace', color: '#9ca3af', fontWeight: 600 },
  userRow: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  userAvatar: {
    width: 26, height: 26, borderRadius: '50%',
    background: '#1f2937',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700, color: '#9ca3af', flexShrink: 0,
  },
  userName: {
    flex: 1, fontSize: 12, color: '#6b7280',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  logoutBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 11, color: '#374151', fontFamily: 'inherit',
    flexShrink: 0,
  },

  // modal
  modalBg: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
  },
  modal: {
    background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
    width: 360,
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 15, fontWeight: 700, color: '#111' },
  modalClose: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#9ca3af', fontSize: 15,
  },
  modalInput: {
    width: '100%', height: 40, padding: '0 12px',
    border: '1.5px solid #e5e7eb', borderRadius: 7,
    fontSize: 14, color: '#111', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16,
  },
  modalActions: { display: 'flex', gap: 8 },
  modalPrimary: {
    flex: 1, height: 38, background: '#111', color: '#fff',
    border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  modalGhost: {
    flex: 1, height: 38, background: '#fff', color: '#374151',
    border: '1.5px solid #e5e7eb', borderRadius: 7, fontSize: 13,
    cursor: 'pointer', fontFamily: 'inherit',
  },
}

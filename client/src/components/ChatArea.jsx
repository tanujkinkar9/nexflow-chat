import { useState, useEffect, useRef } from 'react'

export default function ChatArea({ channel, user, socket }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typingUser, setTypingUser] = useState('')
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (!socket || !channel) return
    setMessages([])

    socket.emit('join_channel', { channelId: channel._id, userId: user.id, username: user.username })

    socket.on('message_history', (history) => setMessages(history))
    socket.on('new_message', (msg) => setMessages(prev => [...prev, msg]))
    socket.on('user_typing', (name) => setTypingUser(name))
    socket.on('user_stop_typing', () => setTypingUser(''))

    return () => {
      socket.emit('leave_channel', { channelId: channel._id })
      socket.off('message_history')
      socket.off('new_message')
      socket.off('user_typing')
      socket.off('user_stop_typing')
    }
  }, [channel?._id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit('send_message', {
      channelId: channel._id,
      content: input,
      senderId: user.id,
      senderName: user.username
    })
    socket.emit('typing_stop', { channelId: channel._id })
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    socket.emit('typing_start', { channelId: channel._id, username: user.username })
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      socket.emit('typing_stop', { channelId: channel._id })
    }, 1500)
  }

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const formatDate = (date) => {
    const d = new Date(date)
    const diff = Date.now() - d
    if (diff < 86400000) return 'Today'
    if (diff < 172800000) return 'Yesterday'
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const grouped = messages.reduce((acc, msg) => {
    const date = formatDate(msg.createdAt)
    if (!acc[date]) acc[date] = []
    acc[date].push(msg)
    return acc
  }, {})

  return (
    <div style={s.root}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerTitle}>
          <span style={s.hash}>#</span>
          <span style={s.channelName}>{channel.name}</span>
        </div>
        {channel.description && (
          <p style={s.channelDesc}>{channel.description}</p>
        )}
      </div>

      {/* Messages */}
      <div style={s.messagesArea}>
        {messages.length === 0 && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>#</div>
            <p style={s.emptyTitle}>Start of #{channel.name}</p>
            <p style={s.emptyDesc}>Send the first message</p>
          </div>
        )}

        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div style={s.dateDivider}>
              <div style={s.dateLine} />
              <span style={s.dateLabel}>{date}</span>
              <div style={s.dateLine} />
            </div>

            {msgs.map((msg, i) => {
              const prev = msgs[i - 1]
              const sameAuthor = prev && prev.senderName === msg.senderName &&
                (new Date(msg.createdAt) - new Date(prev.createdAt)) < 120000
              const isOwn = msg.senderName === user.username

              return (
                <div key={msg._id} style={{ ...s.msgRow, ...(sameAuthor ? s.msgRowGrouped : {}) }}>
                  {!sameAuthor ? (
                    <div style={{ ...s.avatar, background: isOwn ? '#f3f4f6' : '#f3f4f6' }}>
                      <span style={{ ...s.avatarInitial, color: isOwn ? '#111' : '#374151' }}>
                        {msg.senderName[0].toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div style={s.avatarSpacer} />
                  )}

                  <div style={s.msgBody}>
                    {!sameAuthor && (
                      <div style={s.msgMeta}>
                        <span style={{ ...s.msgAuthor, color: isOwn ? '#111' : '#374151' }}>
                          {msg.senderName}
                        </span>
                        <span style={s.msgTime}>{formatTime(msg.createdAt)}</span>
                      </div>
                    )}
                    <p style={s.msgText}>{msg.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {typingUser && (
          <div style={s.typingRow}>
            <div style={s.typingDots}>
              {[0, 150, 300].map(delay => (
                <span key={delay} style={{ ...s.typingDot, animationDelay: `${delay}ms` }} />
              ))}
            </div>
            <span style={s.typingText}>{typingUser} is typing…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={s.inputArea}>
        <div style={s.inputWrap}>
          <input
            style={s.input}
            placeholder={`Message #${channel.name}`}
            value={input}
            onChange={handleTyping}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{ ...s.sendBtn, ...(input.trim() ? s.sendBtnActive : {}) }}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
        <p style={s.inputHint}>Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

const SendIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
  </svg>
)

const s = {
  root: {
    display: 'flex', flexDirection: 'column', height: '100%',
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    background: '#fff',
  },
  header: {
    padding: '0 24px',
    height: 56,
    display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: '1px solid #f3f4f6', flexShrink: 0,
  },
  headerTitle: { display: 'flex', alignItems: 'center', gap: 5 },
  hash: { fontSize: 17, color: '#9ca3af' },
  channelName: { fontSize: 15, fontWeight: 600, color: '#111' },
  channelDesc: { fontSize: 12, color: '#9ca3af', marginLeft: 8 },

  messagesArea: {
    flex: 1, overflowY: 'auto',
    padding: '16px 24px 8px',
    display: 'flex', flexDirection: 'column',
  },

  emptyState: {
    margin: 'auto', textAlign: 'center', padding: 40,
  },
  emptyIcon: {
    fontSize: 36, color: '#e5e7eb', fontWeight: 700, marginBottom: 10,
  },
  emptyTitle: { fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 4px' },
  emptyDesc: { fontSize: 13, color: '#9ca3af', margin: 0 },

  dateDivider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '20px 0 14px',
  },
  dateLine: { flex: 1, height: 1, background: '#f3f4f6' },
  dateLabel: { fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' },

  msgRow: {
    display: 'flex', gap: 10, padding: '3px 0', alignItems: 'flex-start',
  },
  msgRowGrouped: { marginTop: 1 },
  avatar: {
    width: 30, height: 30, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 2,
  },
  avatarInitial: { fontSize: 11, fontWeight: 700 },
  avatarSpacer: { width: 30, flexShrink: 0 },
  msgBody: { flex: 1, minWidth: 0 },
  msgMeta: {
    display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 2,
  },
  msgAuthor: { fontSize: 13, fontWeight: 700 },
  msgTime: { fontSize: 11, color: '#9ca3af' },
  msgText: {
    fontSize: 14, color: '#374151', lineHeight: 1.6,
    margin: 0, wordBreak: 'break-word',
  },

  typingRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 0', marginLeft: 40,
  },
  typingDots: { display: 'flex', gap: 3 },
  typingDot: {
    width: 5, height: 5, borderRadius: '50%', background: '#9ca3af',
    display: 'inline-block',
    animation: 'bounce 1.2s ease-in-out infinite',
  },
  typingText: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic' },

  inputArea: {
    padding: '12px 24px 16px',
    borderTop: '1px solid #f3f4f6', flexShrink: 0,
  },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: 8,
    border: '1.5px solid #e5e7eb', borderRadius: 10,
    padding: '7px 8px 7px 14px',
    background: '#fff',
  },
  input: {
    flex: 1, border: 'none', outline: 'none',
    fontSize: 14, color: '#111', fontFamily: 'inherit',
    background: 'transparent',
  },
  sendBtn: {
    width: 32, height: 32, borderRadius: 7, border: 'none',
    background: '#e5e7eb', color: '#9ca3af',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
    transition: 'background 0.15s, color 0.15s',
  },
  sendBtnActive: { background: '#111', color: '#fff' },
  inputHint: {
    fontSize: 11, color: '#d1d5db', margin: '5px 0 0 2px',
  },
}

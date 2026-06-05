import { useState, useEffect } from 'react'
import api from '../api'

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

const PRIORITIES = {
  low: { label: 'Low', color: '#6b7280', bg: '#f3f4f6' },
  medium: { label: 'Medium', color: '#92400e', bg: '#fef3c7' },
  high: { label: 'High', color: '#991b1b', bg: '#fee2e2' },
}

const COL_ACCENT = {
  todo: { dot: '#9ca3af' },
  inprogress: { dot: '#f59e0b' },
  done: { dot: '#22c55e' },
}

export default function TaskBoard({ workspace, user, socket }) {
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', assigneeName: '' })
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverCol, setDragOverCol] = useState(null)

  useEffect(() => {
    api.get(`/tasks/workspace/${workspace._id}`).then(({ data }) => setTasks(data))
  }, [workspace._id])

  useEffect(() => {
    if (!socket) return
    socket.on('task_changed', (task) => {
      setTasks(prev => prev.map(t => t._id === task._id ? task : t))
    })
    return () => socket.off('task_changed')
  }, [socket])

  const createTask = async () => {
    if (!form.title.trim()) return
    const { data } = await api.post('/tasks', { ...form, workspaceId: workspace._id })
    setTasks(prev => [data, ...prev])
    setForm({ title: '', description: '', priority: 'medium', assigneeName: '' })
    setShowModal(false)
  }

  const moveTask = async (taskId, newStatus) => {
    const { data } = await api.patch(`/tasks/${taskId}/status`, { status: newStatus })
    setTasks(prev => prev.map(t => t._id === taskId ? data : t))
    socket?.emit('task_updated', { workspaceId: workspace._id, task: data })
  }

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`)
    setTasks(prev => prev.filter(t => t._id !== taskId))
  }

  const onDragStart = (task) => setDraggedTask(task)
  const onDragOver = (e, colId) => { e.preventDefault(); setDragOverCol(colId) }
  const onDrop = (colId) => {
    if (draggedTask && draggedTask.status !== colId) moveTask(draggedTask._id, colId)
    setDraggedTask(null)
    setDragOverCol(null)
  }

  return (
    <div style={s.root}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.headerTitle}>Tasks</h2>
          <p style={s.headerSub}>{workspace.name} · {tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button style={s.newTaskBtn} onClick={() => setShowModal(true)}>
          <PlusIcon /> New task
        </button>
      </div>

      {/* Kanban */}
      <div style={s.board}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id)
          const isOver = dragOverCol === col.id

          return (
            <div
              key={col.id}
              style={s.column}
              onDragOver={e => onDragOver(e, col.id)}
              onDrop={() => onDrop(col.id)}
            >
              {/* Column header */}
              <div style={s.colHeader}>
                <div style={s.colHeaderLeft}>
                  <span style={{ ...s.colDot, background: COL_ACCENT[col.id].dot }} />
                  <span style={s.colLabel}>{col.label}</span>
                  <span style={s.colCount}>{colTasks.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div style={{ ...s.dropZone, ...(isOver ? s.dropZoneOver : {}) }}>
                {colTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    col={col}
                    columns={COLUMNS}
                    onDragStart={onDragStart}
                    onMove={moveTask}
                    onDelete={deleteTask}
                  />
                ))}

                {colTasks.length === 0 && (
                  <div style={s.emptyCol}>
                    {isOver ? 'Drop here' : 'No tasks'}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* New task modal */}
      {showModal && (
        <div style={s.modalBg} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>New task</span>
              <button style={s.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={s.modalBody}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Title</label>
                <input
                  style={s.input}
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && createTask()}
                  autoFocus
                />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Description <span style={s.optional}>(optional)</span></label>
                <textarea
                  style={{ ...s.input, ...s.textarea }}
                  rows={2}
                  placeholder="Add more context..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div style={s.row}>
                <div style={{ ...s.fieldGroup, flex: 1 }}>
                  <label style={s.label}>Priority</label>
                  <select
                    style={s.input}
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div style={{ ...s.fieldGroup, flex: 1 }}>
                  <label style={s.label}>Assignee</label>
                  <input
                    style={s.input}
                    placeholder="Username"
                    value={form.assigneeName}
                    onChange={e => setForm({ ...form, assigneeName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.modalPrimary} onClick={createTask}>Create task</button>
              <button style={s.modalGhost} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, col, columns, onDragStart, onMove, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const p = PRIORITIES[task.priority] || PRIORITIES.medium

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...s.card, ...(hovered ? s.cardHovered : {}) }}
    >
      {/* Top row */}
      <div style={s.cardTop}>
        <p style={s.cardTitle}>{task.title}</p>
        <button
          style={{ ...s.deleteBtn, opacity: hovered ? 1 : 0 }}
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
        >
          <CloseIcon />
        </button>
      </div>

      {task.description && (
        <p style={s.cardDesc}>{task.description}</p>
      )}

      {/* Footer */}
      <div style={s.cardFooter}>
        <span style={{ ...s.priority, color: p.color, background: p.bg }}>
          {p.label}
        </span>
        {task.assigneeName && (
          <div style={s.assignee}>
            <div style={s.assigneeAvatar}>{task.assigneeName[0].toUpperCase()}</div>
            <span style={s.assigneeName}>{task.assigneeName}</span>
          </div>
        )}
      </div>

      {/* Quick move */}
      {hovered && (
        <div style={s.quickMove}>
          {columns.filter(c => c.id !== col.id).map(c => (
            <button key={c.id} style={s.quickMoveBtn} onClick={() => onMove(task._id, c.id)}>
              → {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const CloseIcon = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  root: {
    display: 'flex', flexDirection: 'column', height: '100%',
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    background: '#fff',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: 56,
    borderBottom: '1px solid #f3f4f6', flexShrink: 0,
  },
  headerTitle: { fontSize: 15, fontWeight: 600, color: '#111', margin: 0 },
  headerSub: { fontSize: 12, color: '#9ca3af', margin: '2px 0 0' },
  newTaskBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#111', color: '#fff', border: 'none',
    borderRadius: 7, fontSize: 13, fontWeight: 600,
    padding: '7px 14px', cursor: 'pointer', fontFamily: 'inherit',
  },

  board: {
    flex: 1, display: 'flex', gap: 16,
    padding: '20px 24px', overflowX: 'auto', overflowY: 'hidden',
    minWidth: 0,
  },
  column: {
    flex: 1, display: 'flex', flexDirection: 'column',
    minWidth: 220, maxWidth: 320,
  },
  colHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  colHeaderLeft: { display: 'flex', alignItems: 'center', gap: 7 },
  colDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  colLabel: { fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: '0.01em' },
  colCount: {
    fontSize: 11, color: '#9ca3af',
    background: '#f3f4f6', borderRadius: 10,
    padding: '1px 6px', fontWeight: 600,
  },

  dropZone: {
    flex: 1, borderRadius: 10,
    background: '#fafafa',
    border: '1.5px solid #f3f4f6',
    padding: 8, display: 'flex', flexDirection: 'column', gap: 6,
    minHeight: 200, transition: 'border-color 0.15s, background 0.15s',
    overflowY: 'auto',
  },
  dropZoneOver: {
    borderColor: '#d1d5db', background: '#f3f4f6',
  },
  emptyCol: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, color: '#d1d5db', minHeight: 80,
  },

  card: {
    background: '#fff', border: '1.5px solid #f3f4f6',
    borderRadius: 8, padding: '10px 12px',
    cursor: 'grab', transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  cardHovered: {
    borderColor: '#e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardTop: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6,
  },
  cardTitle: {
    fontSize: 13, fontWeight: 600, color: '#111',
    lineHeight: 1.4, margin: 0, flex: 1,
  },
  deleteBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#d1d5db', padding: 2, flexShrink: 0,
    transition: 'color 0.15s, opacity 0.15s',
    display: 'flex', alignItems: 'center',
  },
  cardDesc: {
    fontSize: 12, color: '#9ca3af', lineHeight: 1.5,
    margin: '4px 0 0', display: '-webkit-box',
    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 8,
  },
  priority: {
    fontSize: 11, fontWeight: 600,
    padding: '2px 7px', borderRadius: 10,
  },
  assignee: { display: 'flex', alignItems: 'center', gap: 5 },
  assigneeAvatar: {
    width: 18, height: 18, borderRadius: '50%',
    background: '#f3f4f6',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 9, fontWeight: 700, color: '#374151',
  },
  assigneeName: { fontSize: 11, color: '#9ca3af' },

  quickMove: {
    display: 'flex', gap: 4, marginTop: 8,
    paddingTop: 8, borderTop: '1px solid #f3f4f6',
  },
  quickMoveBtn: {
    fontSize: 11, color: '#9ca3af',
    background: '#f9fafb', border: '1px solid #f3f4f6',
    borderRadius: 4, padding: '2px 7px', cursor: 'pointer',
    fontFamily: 'inherit', transition: 'color 0.1s, border-color 0.1s',
  },

  // Modal
  modalBg: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
  },
  modal: {
    background: '#fff', borderRadius: 12,
    width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px 0',
  },
  modalTitle: { fontSize: 15, fontWeight: 700, color: '#111' },
  modalClose: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#9ca3af', fontSize: 15, padding: 2,
  },
  modalBody: {
    padding: '16px 24px',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12, fontWeight: 600, color: '#374151' },
  optional: { fontWeight: 400, color: '#9ca3af' },
  input: {
    width: '100%', height: 38, padding: '0 12px',
    border: '1.5px solid #e5e7eb', borderRadius: 7,
    fontSize: 13, color: '#111', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
    background: '#fff',
  },
  textarea: { height: 'auto', padding: '8px 12px', resize: 'none' },
  row: { display: 'flex', gap: 12 },
  modalFooter: {
    display: 'flex', gap: 8,
    padding: '0 24px 20px',
  },
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

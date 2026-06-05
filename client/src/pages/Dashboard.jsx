import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import TaskBoard from '../components/TaskBoard'
import WorkspaceSetup from '../components/WorkspaceSetup'
import { io } from 'socket.io-client'

let socket = null

export default function Dashboard() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [workspaces, setWorkspaces] = useState([])
  const [activeWorkspace, setActiveWorkspace] = useState(null)
  const [channels, setChannels] = useState([])
  const [activeChannel, setActiveChannel] = useState(null)
  const [activeView, setActiveView] = useState('chat') // 'chat' | 'tasks'
  const [onlineUsers, setOnlineUsers] = useState({})
  const [loading, setLoading] = useState(true)

  // Init socket
  useEffect(() => {
    socket = io('http://localhost:5000')
    return () => socket.disconnect()
  }, [])

  // Load workspaces
  useEffect(() => {
    api.get('/workspaces').then(({ data }) => {
      setWorkspaces(data)
      if (data.length > 0) setActiveWorkspace(data[0])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Load channels when workspace changes
  useEffect(() => {
    if (!activeWorkspace) return
    api.get(`/channels/workspace/${activeWorkspace._id}`).then(({ data }) => {
      setChannels(data)
      if (data.length > 0) setActiveChannel(data[0])
    })
    // Join workspace for presence
    if (socket && user) {
      socket.emit('join_workspace', {
        workspaceId: activeWorkspace._id,
        userId: user.id,
        username: user.username
      })
      socket.on('online_users', (users) => setOnlineUsers(users))
    }
  }, [activeWorkspace])

  const handleWorkspaceCreated = (ws) => {
    setWorkspaces(prev => [...prev, ws])
    setActiveWorkspace(ws)
  }

  const handleChannelCreated = (ch) => {
    setChannels(prev => [...prev, ch])
    setActiveChannel(ch)
  }

  const handleLogout = () => { logout(); navigate('/') }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white text-sm text-gray-400">
      Loading workspace...
    </div>
  )

  if (!activeWorkspace && !loading) {
    return <WorkspaceSetup onCreated={handleWorkspaceCreated} />
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        channels={channels}
        activeChannel={activeChannel}
        setActiveChannel={(ch) => { setActiveChannel(ch); setActiveView('chat') }}
        activeView={activeView}
        setActiveView={setActiveView}
        onlineUsers={onlineUsers}
        user={user}
        onChannelCreated={handleChannelCreated}
        onWorkspaceCreated={handleWorkspaceCreated}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'chat' && activeChannel && (
          <ChatArea
            channel={activeChannel}
            user={user}
            socket={socket}
            onlineUsers={onlineUsers}
          />
        )}
        {activeView === 'tasks' && activeWorkspace && (
          <TaskBoard workspace={activeWorkspace} user={user} socket={socket} />
        )}
      </main>
    </div>
  )
}

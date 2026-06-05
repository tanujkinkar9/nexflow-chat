import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('nexflow_token')
    const u = localStorage.getItem('nexflow_user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    setLoading(false)
  }, [])

  const login = (token, user) => {
    setToken(token); setUser(user)
    localStorage.setItem('nexflow_token', token)
    localStorage.setItem('nexflow_user', JSON.stringify(user))
  }

  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('nexflow_token')
    localStorage.removeItem('nexflow_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

import React, { useState, useEffect } from 'react'
import Login from '../components/Login'
import AdminPanel from '../components/AdminPanel'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('jifma_token')
    const savedUser = localStorage.getItem('jifma_user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('jifma_token')
    localStorage.removeItem('jifma_user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return <AdminPanel user={user} token={token} onLogout={handleLogout} />
}

export default Admin


import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './src/pages/Home'
import Login from './src/pages/Login'
import Register from './src/pages/Register'
import ProtectedRoute from './src/components/auth/ProtectedRoute'
import PublicRoute from './src/components/auth/PublicRoute'
import { AuthProvider } from './src/context/AuthContext'
import { logUserVisit } from './src/services/userLogService'

export default function App() {
  useEffect(() => {
    logUserVisit();
  }, [])

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes (Only accessible when NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes (Only accessible when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

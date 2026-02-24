import React, { useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './src/pages/Home'
import Login from './src/pages/Login'
import Register from './src/pages/Register'
import ProtectedRoute from './src/components/auth/ProtectedRoute'
import PublicRoute from './src/components/auth/PublicRoute'
import { AuthProvider } from './src/context/AuthContext'
import { logUserVisit } from './src/services/userLogService'
import Sidebar from './src/components/Sidebar'
import Header from './src/components/Header'

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-20 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

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
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

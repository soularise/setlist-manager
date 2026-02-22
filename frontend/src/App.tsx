import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Nav from '@/components/ui/Nav'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import SetlistDetail from '@/pages/SetlistDetail'
import Songs from '@/pages/Songs'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return null
  if (!session) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Nav />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/songs"
          element={
            <ProtectedLayout>
              <Songs />
            </ProtectedLayout>
          }
        />
        <Route
          path="/setlists/:id"
          element={
            <ProtectedLayout>
              <SetlistDetail />
            </ProtectedLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

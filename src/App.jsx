import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Skolar from './pages/Skolar'
import Nemendur from './pages/Nemendur'
import Adstandendur from './pages/Adstandendur'
import Starfsmenn from './pages/Starfsmenn'
import Vinnuskyrslur from './pages/Vinnuskyrslur'
import Astundun from './pages/Astundun'
import Postur from './pages/Postur'
import Frettir from './pages/Frettir'
import Notendur from './pages/Notendur'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="skolar"
            element={
              <ProtectedRoute>
                <Skolar />
              </ProtectedRoute>
            }
          />
          <Route
            path="nemendur"
            element={
              <ProtectedRoute>
                <Nemendur />
              </ProtectedRoute>
            }
          />
          <Route
            path="adstandendur"
            element={
              <ProtectedRoute>
                <Adstandendur />
              </ProtectedRoute>
            }
          />
          <Route
            path="starfsmenn"
            element={
              <ProtectedRoute>
                <Starfsmenn />
              </ProtectedRoute>
            }
          />
          <Route
            path="vinnuskyrslur"
            element={
              <ProtectedRoute>
                <Vinnuskyrslur />
              </ProtectedRoute>
            }
          />
          <Route
            path="astundun"
            element={
              <ProtectedRoute>
                <Astundun />
              </ProtectedRoute>
            }
          />
          <Route
            path="postur"
            element={
              <ProtectedRoute>
                <Postur />
              </ProtectedRoute>
            }
          />
          <Route
            path="frettir"
            element={
              <ProtectedRoute>
                <Frettir />
              </ProtectedRoute>
            }
          />
          {/* Admin only route */}
          <Route
            path="notendur"
            element={
              <ProtectedRoute requiredRole="admin">
                <Notendur />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

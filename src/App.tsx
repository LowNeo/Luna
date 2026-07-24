import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Aujourdhui } from './pages/Aujourdhui'
import { Journal } from './pages/Journal'
import { Lune } from './pages/Lune'
import { Schemas } from './pages/Schemas'
import { Corps } from './pages/Corps'
import { Rappels } from './pages/Rappels'
import { Connexion } from './pages/Connexion'
import { useSession } from './hooks/useSession'

function App() {
  const { session, chargement } = useSession()

  // Petit splash le temps de récupérer la session
  if (chargement) {
    return (
      <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center' }}>
        <span
          className="titre"
          style={{ fontSize: 22, letterSpacing: '0.24em', opacity: 0.7 }}
        >
          LUNA
        </span>
      </div>
    )
  }

  // Non connecté → écran de connexion
  if (!session) return <Connexion />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Aujourdhui />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/lune" element={<Lune />} />
          <Route path="/schemas" element={<Schemas />} />
          <Route path="/corps" element={<Corps />} />
          <Route path="/rappels" element={<Rappels />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

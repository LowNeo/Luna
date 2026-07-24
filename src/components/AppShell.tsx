import { NavLink, Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

// Cadre commun à tous les écrans :
//   barre haute légère (marque + accès profil/corps) + contenu défilant + nav basse
export function AppShell() {
  return (
    <div className="app">
      <header className="topbar">
        <span className="topbar__marque">LUNA</span>
        <NavLink
          to="/corps"
          className={({ isActive }) =>
            isActive ? 'topbar__profil actif' : 'topbar__profil'
          }
          aria-label="Profil et suivi du corps"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M5.5 19a6.5 6.5 0 0 1 13 0"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </NavLink>
      </header>

      <main className="app__contenu">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}

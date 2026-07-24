import { NavLink, useNavigate } from 'react-router-dom'

// Barre de navigation basse : Jour · Journal · [+] · Lune · Schémas
export function BottomNav() {
  const navigate = useNavigate()

  const lien = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav__item actif' : 'nav__item'

  return (
    <nav className="nav" aria-label="Navigation principale">
      <NavLink to="/" end className={lien}>
        <IconeJour />
        <span>Jour</span>
      </NavLink>

      <NavLink to="/journal" className={lien}>
        <IconeJournal />
        <span>Journal</span>
      </NavLink>

      {/* Bouton d'ajout rapide — renvoie vers l'écran du jour */}
      <button
        type="button"
        className="nav__fab"
        aria-label="Ajouter un moment"
        onClick={() => navigate('/')}
      >
        <IconePlus />
      </button>

      <NavLink to="/lune" className={lien}>
        <IconeLune />
        <span>Lune</span>
      </NavLink>

      <NavLink to="/schemas" className={lien}>
        <IconeSchemas />
        <span>Schémas</span>
      </NavLink>
    </nav>
  )
}

/* --- Icônes (inline, trait fin) --- */

function IconeJour() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3a9 9 0 0 0 0 18 6 6 0 0 1 0-18Z" fill="currentColor" opacity=".5" />
    </svg>
  )
}

function IconeJournal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconePlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconeLune() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function IconeSchemas() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 19V9M12 19V5M19 19v-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

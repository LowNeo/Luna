import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/auth.css'

type Mode = 'connexion' | 'inscription'

// Traduit quelques messages d'erreur Supabase courants
function traduire(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return 'Email ou mot de passe incorrect.'
  if (/password should be at least/i.test(msg)) return 'Mot de passe trop court (6 caractères min).'
  if (/user already registered/i.test(msg)) return 'Un compte existe déjà avec cet email.'
  return msg
}

// Écran de connexion / inscription (email + mot de passe).
export function Connexion() {
  const [mode, setMode] = useState<Mode>('connexion')
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function soumettre(e: FormEvent) {
    e.preventDefault()
    setErreur(null)
    setMessage(null)
    setEnCours(true)

    if (mode === 'connexion') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: mdp })
      if (error) setErreur(traduire(error.message))
      // Succès : onAuthStateChange bascule l'app automatiquement.
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password: mdp })
      if (error) setErreur(traduire(error.message))
      else if (!data.session) {
        setMessage('Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.')
        setMode('connexion')
      }
    }
    setEnCours(false)
  }

  return (
    <div className="auth">
      <div className="auth__bloc">
        <p className="auth__marque">LUNA</p>
        <h1 className="titre titre--l auth__titre">
          {mode === 'connexion' ? 'Ravi de te revoir' : 'Bienvenue'}
        </h1>
        <p className="texte-dim auth__sous">Ton journal de suivi personnel.</p>

        <form className="auth__form" onSubmit={soumettre}>
          <input
            type="email"
            className="champ-heure"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="champ-heure"
            placeholder="Mot de passe"
            autoComplete={mode === 'connexion' ? 'current-password' : 'new-password'}
            required
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
          />

          {erreur && <p className="auth__erreur">{erreur}</p>}
          {message && <p className="auth__message">{message}</p>}

          <button type="submit" className="btn btn--plein auth__submit" disabled={enCours}>
            {enCours ? '…' : mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <button
          type="button"
          className="auth__bascule"
          onClick={() => {
            setMode(mode === 'connexion' ? 'inscription' : 'connexion')
            setErreur(null)
            setMessage(null)
          }}
        >
          {mode === 'connexion'
            ? 'Pas encore de compte ? En créer un'
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  )
}

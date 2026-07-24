import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Aujourdhui } from './pages/Aujourdhui'
import { Journal } from './pages/Journal'
import { Lune } from './pages/Lune'
import { Schemas } from './pages/Schemas'
import { Corps } from './pages/Corps'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Aujourdhui />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/lune" element={<Lune />} />
          <Route path="/schemas" element={<Schemas />} />
          <Route path="/corps" element={<Corps />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Skolar from './pages/Skolar'
import Nemendur from './pages/Nemendur'
import Adstandendur from './pages/Adstandendur'
import Starfsmenn from './pages/Starfsmenn'
import Vinnuskyrslur from './pages/Vinnuskyrslur'
import Astundun from './pages/Astundun'
import Postur from './pages/Postur'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="skolar" element={<Skolar />} />
          <Route path="nemendur" element={<Nemendur />} />
          <Route path="adstandendur" element={<Adstandendur />} />
          <Route path="starfsmenn" element={<Starfsmenn />} />
          <Route path="vinnuskyrslur" element={<Vinnuskyrslur />} />
          <Route path="astundun" element={<Astundun />} />
          <Route path="postur" element={<Postur />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

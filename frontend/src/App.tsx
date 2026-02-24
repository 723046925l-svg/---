import { Link, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { SamplesPage } from './pages/SamplesPage'
import { TemplatesPage } from './pages/TemplatesPage'

export const App = () => (
  <div style={{ fontFamily: 'Arial', padding: 16 }}>
    <h1>Poultry LIMS</h1>
    <nav style={{ display: 'flex', gap: 12 }}>
      <Link to='/'>Dashboard</Link>
      <Link to='/samples'>Samples</Link>
      <Link to='/templates'>Templates</Link>
    </nav>
    <Routes>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/samples' element={<SamplesPage />} />
      <Route path='/templates' element={<TemplatesPage />} />
    </Routes>
  </div>
)

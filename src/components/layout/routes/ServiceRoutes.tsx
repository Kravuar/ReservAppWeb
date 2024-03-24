import ServicesPage from '../../pages/public/ServicesPage'
import { Routes, Route } from 'react-router-dom'

export default function ServiceRoutes() {
  return (
    <Routes>
      <Route path=":id" element={<ServicesPage />} />
      <Route index element={<ServicesPage />} />
    </Routes>
  )
}

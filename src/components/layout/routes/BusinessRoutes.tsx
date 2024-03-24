import BusinessesPage from "../../pages/public/BusinessesPage";
import { Routes, Route } from "react-router-dom";

export default function BusinessRoutes() {
  return (
    <Routes>
      <Route index element={<BusinessesPage />} />
    </Routes>
  );
}

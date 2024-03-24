import { Routes, Route, Navigate } from "react-router-dom";
import ServiceRoutes from "./ServiceRoutes";
import BusinessRoutes from "./BusinessRoutes";

export default function HomeRoutes() {
  return (
    <Routes>
      <Route path="services" element={<ServiceRoutes />} />
      <Route path="businesses" element={<BusinessRoutes />} />
      <Route index element={<Navigate to="services" replace />} />
    </Routes>
  );
}

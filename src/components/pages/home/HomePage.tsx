import { Routes, Route, Navigate } from "react-router-dom";
import ServicesTab from "./ServicesTab";
import BusinessTab from "./BusinessTab";

export default function HomePage() {
  return (
    <Routes>
      <Route path="services" element={<ServicesTab />} />
      <Route path="businesses" element={<BusinessTab />} />
      <Route index element={<Navigate to="services" replace />} />
    </Routes>
  );
}

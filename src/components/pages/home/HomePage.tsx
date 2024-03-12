import { Routes, Route } from "react-router-dom";
import ServicesTab from "./ServicesTab";

export default function HomePage() {
  return (
    <Routes>
      <Route path="services" element={<ServicesTab />} />
    </Routes>
  );
}

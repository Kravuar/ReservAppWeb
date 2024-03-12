import { Routes, Route } from "react-router-dom";
import BusinessTab from "./BusinessTab";

export default function ProfilePage() {
  return (
    <Routes>
      <Route path="business" element={<BusinessTab />} />
    </Routes>
  );
}

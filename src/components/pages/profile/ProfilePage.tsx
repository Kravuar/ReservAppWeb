import { Routes, Route, Navigate } from "react-router-dom";
import ProfileBusinessTab from "./ProfileBusinessTab";

export default function ProfilePage() {
  return (
    <Routes>
      <Route index element={<Navigate to="businesses" replace />} />
      <Route path="businesses" element={<ProfileBusinessTab />} />
    </Routes>
  );
}

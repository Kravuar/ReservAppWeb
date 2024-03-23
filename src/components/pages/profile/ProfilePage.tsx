import { Routes, Route, Navigate } from "react-router-dom";
import ProfileBusinessTab from "./ProfileBusinessTab";

export default function ProfilePage() {
  return (
    <Routes>
      <Route path="businesses" element={<ProfileBusinessTab />} />
      <Route index element={<Navigate to="businesses" replace />} />
    </Routes>
  );
}

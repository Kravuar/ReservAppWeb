import { Container } from "@mui/material";
import Header from "../Header";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "../../pages/profile/ProfilePage";
import { RequiredAuth } from "../../util/SecureRouteCustom";
import HomeRoutes from "./HomeRoutes";

export default function AppContainer() {
  return (
    <>
      <Header
        tabs={[
          { displayName: "Главная", route: "/" },
          { displayName: "Услуги", route: "/services" },
          { displayName: "Бизнесы", route: "/businesses" },
        ]}
      />
      <Container sx={{marginY: 2}}>
        <Routes>
          <Route element={<RequiredAuth />}>
            <Route path="profile/*" element={<ProfilePage />} />
          </Route>
          <Route path="home/*" element={<HomeRoutes />} />
          <Route index element={<Navigate to="home" replace />} />
        </Routes>
      </Container>
    </>
  );
}

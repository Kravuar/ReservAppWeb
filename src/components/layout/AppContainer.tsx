import { Container } from "@mui/material";
import Header from "./Header";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequiredAuth } from "../util/SecureRouteCustom";
import ProfileBusinessTab from "../pages/profile/ProfileBusinessTab";
import BusinessesPage from "../pages/public/BusinessesPage";
import ServicePage from "../pages/public/ServicePage";
import ServicesPage from "../pages/public/ServicesPage";

export default function AppContainer() {
  return (
    <>
      <Header
        tabs={[
          { displayName: "Главная", route: "/" },
          { displayName: "Услуги", route: "/home/services" },
          { displayName: "Бизнесы", route: "/home/businesses" },
        ]}
      />
      <Container sx={{ marginY: 2 }}>
        <Routes>
          <Route element={<RequiredAuth />}>
            <Route path="profile">
              <Route path="businesses" element={<ProfileBusinessTab />} />
              <Route index element={<Navigate to="businesses" replace />} />
            </Route>
          </Route>
          <Route path="home">
            <Route path="services">
              <Route path=":id" element={<ServicePage />} />
              <Route index element={<ServicesPage />} />
            </Route>
            <Route path="businesses">
              <Route index element={<BusinessesPage />} />
            </Route>
            <Route index element={<Navigate to="services" replace />} />
          </Route>
          <Route index element={<Navigate to="home" replace />} />
        </Routes>
      </Container>
    </>
  );
}

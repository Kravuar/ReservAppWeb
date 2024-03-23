import { Container } from "@mui/material";
import Header from "./Header";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import ProfilePage from "../pages/profile/ProfilePage";
import { RequiredAuth } from "../util/SecureRouteCustom";

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
            <Route path="/profile/*" element={<ProfilePage />} />
          </Route>
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </Container>
    </>
  );
}

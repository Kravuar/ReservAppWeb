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
        ]}
      />
      <Container sx={{marginY: 2}}>
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route element={<RequiredAuth />}>
            <Route path="/profile/*" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
}

import { Box, Tab, Tabs } from "@mui/material";
import useAuthUser from "../../../services/oauth/useOAuthUser";
import ProfileCard from "../../parts/ProfileCard";
import { useState } from "react";
import ProfileBusinessesTab from "./ProfileBusinessesTab";
import {
  myDetailedBusinesses,
  myReservations,
  cancelReservation,
  restoreReservation,
  createBusiness,
} from "../../../services/api";
import { BusinessDetailed, BusinessFormData } from "../../../domain/Business";
import { Page } from "../../../domain/Page";
import { ReservationDetailed } from "../../../domain/Schedule";
import { LocalDate } from "@js-joda/core";
import ProfileReservationsTab from "./ProfileReservationsTab";
import ProfileReservationsToMeTab from "./ProfileReservationsToMeTab";
import { useAlert } from "../../util/Alert";

export default function ProfilePage() {
  const user = useAuthUser();
  const { withErrorAlert, withAlert } = useAlert();
  const [tab, setTab] = useState(0);

  async function fetchBusinesses(
    page: number
  ): Promise<Page<BusinessDetailed>> {
    return withErrorAlert(() => myDetailedBusinesses(page, 10));
  }

  async function onCancelReservation(reservationId: number) {
    return withAlert(
      () => withErrorAlert(() => cancelReservation(reservationId)),
      "Запись отменена",
      "success"
    );
  }

  async function onReservationRestore(reservationId: number) {
    return withAlert(
      () => withErrorAlert(() => restoreReservation(reservationId)),
      "Запись восстановлена",
      "success"
    );
  }

  async function fetchReservations(
    from: LocalDate,
    to: LocalDate
  ): Promise<Map<LocalDate, ReservationDetailed[]>> {
    return withErrorAlert(() => myReservations(from, to));
  }

  async function businessCreationHandler(formData: BusinessFormData): Promise<BusinessDetailed> {
    return withAlert(
      () => withErrorAlert(() => createBusiness(formData)),
      "Бизнес создан",
      "success"
    );
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between">
      <ProfileCard name={user?.name} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Tabs
          variant="scrollable"
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ tabSize: 50 }}
        >
          <Tab label="Мои бизнесы" />
          <Tab label="Мои записи" />
          <Tab label="Записи ко мне" />
        </Tabs>
        <Box sx={{ padding: 3 }}>
          {tab === 0 && (
            <ProfileBusinessesTab
              pageSupplier={fetchBusinesses}
              businessCreationHandler={businessCreationHandler}
            />
          )}
          {tab === 1 && (
            <ProfileReservationsTab
              onCancelReservation={onCancelReservation}
              onReservationRestore={onReservationRestore}
              reservationsSupplier={fetchReservations}
            />
          )}
          {tab === 2 && (
            <ProfileReservationsToMeTab
              onCancelReservation={onCancelReservation}
              reservationsSupplier={fetchReservations}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

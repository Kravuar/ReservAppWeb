import { Box, Tab, Tabs } from "@mui/material";
import useAuthUser from "../../../services/oauth/useOAuthUser";
import ProfileCard from "../../parts/ProfileCard";
import { useState } from "react";
import ProfileBusinessesTab from "../../parts/ProfileBusinessesTab";
import {
  myDetailedBusinesses,
  myReservations,
  cancelReservation,
  restoreReservation,
  createBusiness,
  servicesByBusiness,
  staffByBusinessId,
  createService,
  inviteStaff,
} from "../../../services/api";
import { BusinessDetailed, BusinessFormData } from "../../../domain/Business";
import { Page } from "../../../domain/Page";
import { ReservationDetailed } from "../../../domain/Schedule";
import { LocalDate } from "@js-joda/core";
import ProfileReservationsTab from "../../parts/ProfileReservationsTab";
import ProfileReservationsToMeTab from "../../parts/ProfileReservationsToMeTab";
import { useAlert } from "../../util/Alert";
import { ServiceDetailed, ServiceFormData } from "../../../domain/Service";
import { Staff } from "../../../domain/Staff";

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

  async function businessCreationHandler(
    formData: BusinessFormData
  ): Promise<BusinessDetailed> {
    return withAlert(
      () => withErrorAlert(() => createBusiness(formData)),
      "Бизнес создан",
      "success"
    );
  }

  async function servicePageSupplier(
    businessId: number,
    name: string,
    page: number
  ): Promise<Page<ServiceDetailed>> {
    // TODO: adjust, when server implements search
    return withErrorAlert(() => servicesByBusiness(businessId, page, 10));
  }

  async function staffPageSupplier(
    businessId: number,
    page: number
  ): Promise<Page<Staff>> {
    return withErrorAlert(() => staffByBusinessId(businessId, page, 10));
  }

  async function serviceCreationHandler(
    formData: ServiceFormData
  ): Promise<void> {
    return withAlert(
      () => withErrorAlert(() => createService(formData)),
      "Услуга добавлена",
      "success"
    ).then();
  }

  async function staffInvitationHandler(
    subject: string,
    businessId: number
  ): Promise<void> {
    return withAlert(
      () => withErrorAlert(() => inviteStaff(subject, businessId)),
      "Сотрудник приглашён",
      "success"
    ).then();
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
              servicePageSupplier={servicePageSupplier}
              staffPageSupplier={staffPageSupplier}
              serviceCreationHandler={serviceCreationHandler}
              staffInvitationHandler={staffInvitationHandler}
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

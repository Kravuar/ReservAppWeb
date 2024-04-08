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
  removeStaff,
  reservationsToMe,
  getMyInvitations,
  getInvitationsOfBusiness,
  acceptInvitation,
  declineInvitation,
} from "../../../services/api";
import { BusinessDetailed, BusinessFormData } from "../../../domain/Business";
import { Page } from "../../../domain/Page";
import { ReservationDetailed, ReservationFromClientDetailed } from "../../../domain/Schedule";
import { LocalDate } from "@js-joda/core";
import ProfileReservationsTab from "../../parts/ProfileReservationsTab";
import { useAlert } from "../../util/Alert";
import { ServiceDetailed, ServiceFormData } from "../../../domain/Service";
import { Staff, StaffInvitationDetailed } from "../../../domain/Staff";
import ReservationCard from "../../parts/ReservationCard";
import ReservationFromClientCard from "../../parts/ReservationFromClientCard";
import ProfileInvitationTab from "../../parts/ProfileInvitationTab";

export default function ProfilePage() {
  const user = useAuthUser();
  const { withErrorAlert, withAlert } = useAlert();
  const [tab, setTab] = useState(0);

  async function fetchBusinesses(
    page: number
  ): Promise<Page<BusinessDetailed>> {
    return withErrorAlert(() => myDetailedBusinesses(page, 10));
  }

  async function reservationCancelHandler(reservationId: number) {
    return withAlert(
      () => withErrorAlert(() => cancelReservation(reservationId)),
      "Запись отменена",
      "success"
    );
  }

  async function reservationRestoreHandler(reservationId: number) {
    return withAlert(
      () => withErrorAlert(() => restoreReservation(reservationId)),
      "Запись восстановлена",
      "success"
    );
  }

  async function fetchMyReservations(
    from: LocalDate,
    to: LocalDate
  ): Promise<Map<LocalDate, ReservationDetailed[]>> {
    return withErrorAlert(() => myReservations(from, to));
  }

  async function fetchReservationsToMe(
    from: LocalDate,
    to: LocalDate
  ): Promise<Map<LocalDate, ReservationFromClientDetailed[]>> {
    return withErrorAlert(() => reservationsToMe(from, to));
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

  async function staffRemovalHandler(staffId: number): Promise<void> {
    return withAlert(
      () => withErrorAlert(() => removeStaff(staffId)),
      "Сотрудник отстранён",
      "success"
    ).then();
  }

  async function invitationSupplierByUser(page: number): Promise<Page<StaffInvitationDetailed>> {
    return withErrorAlert(() => getMyInvitations(page, 10));
  }
  
  async function invitationSupplierByBusiness(businessId: number, page: number): Promise<Page<StaffInvitationDetailed>> {
    return withErrorAlert(() => getInvitationsOfBusiness(businessId, page, 10));
  }

  async function acceptInvitationHandler(invitationId: number): Promise<void> {
    return withAlert(
      () => withErrorAlert(() => acceptInvitation(invitationId)),
      "Приглашение принято",
      "success"
    ).then();
  }

  async function declineInvitationHandler(invitationId: number): Promise<void> {
    return withAlert(
      () => withErrorAlert(() => declineInvitation(invitationId)),
      "Приглашение отклонено  ",
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
          <Tab label="Управление бизнесом" />
          <Tab label="Мои записи" />
          <Tab label="Записи ко мне" />
          <Tab label="Мои приглашения" />
        </Tabs>
        <Box sx={{ padding: 3 }}>
          {tab === 0 && (
            <ProfileBusinessesTab
              pageSupplier={fetchBusinesses}
              businessCreationHandler={businessCreationHandler}
              servicePageSupplier={servicePageSupplier}
              staffPageSupplier={staffPageSupplier}
              invitationPageSupplier={invitationSupplierByBusiness}
              serviceCreationHandler={serviceCreationHandler}
              staffInvitationHandler={staffInvitationHandler}
              staffRemovalHandler={staffRemovalHandler}
              invitationDeclineHandler={declineInvitationHandler}
            />
          )}
          {tab === 1 && (
            <ProfileReservationsTab
              cancelHandler={reservationCancelHandler}
              restoreHandler={reservationRestoreHandler}
              reservationsSupplier={fetchMyReservations}
              CardComponent={ReservationCard}
            />
          )}
          {tab === 2 && (
            <ProfileReservationsTab
              cancelHandler={reservationCancelHandler}
              restoreHandler={reservationRestoreHandler}
              reservationsSupplier={fetchReservationsToMe}
              CardComponent={ReservationFromClientCard}
            />
          )}
          {tab === 3 && (
            <ProfileInvitationTab
              pageSupplier={invitationSupplierByUser}
              acceptHandler={acceptInvitationHandler}
              declineHandler={declineInvitationHandler}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

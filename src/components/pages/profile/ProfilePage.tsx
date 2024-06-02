import { Box, Tab, Tabs } from "@mui/material";
import useAuthUser from "../../../services/oauth/useOAuthUser";
import ProfileCard from "../../parts/ProfileCard";
import { useState } from "react";
import ProfileBusinessesTab from "../../parts/ProfileBusinessesTab";
import { Business, BusinessFormData } from "../../../domain/Business";
import { Page } from "../../../domain/Page";
import { Reservation } from "../../../domain/Schedule";
import { LocalDate } from "@js-joda/core";
import ProfileReservationsTab from "../../parts/ProfileReservationsTab";
import { useAlert } from "../../util/Alert";
import { Service, ServiceFormData } from "../../../domain/Service";
import { Staff, StaffInvitation } from "../../../domain/Staff";
import ReservationCard from "../../parts/ReservationCard";
import ReservationFromClientCard from "../../parts/ReservationFromClientCard";
import ProfileInvitationTab from "../../parts/ProfileInvitationTab";
import { gql, useApolloClient } from "@apollo/client";
import { groupBy } from "../../../services/utils";

const myBusinessesQuery = gql`
  query MyBusinesses($page: Int!) {
    myBusinesses(page: $page, pageSize: 10) {
      content {
        id
        name
        ownerSub
        active
        description
      }
      totalPages
    }
  }
`;

const myReservationsQuery = gql`
  query MyReservations($from: LocalDate!, $to: LocalDate!) {
    myReservations(from: $from, to: $to) {
      id
      date
      start
      end
      cost
      active
      staff {
        name
      }
    }
  }
`;

const reservationsToMeQuery = gql`
  query ReservationsToMe($from: LocalDate!, $to: LocalDate!) {
    reservationsToMe(from: $from, to: $to) {
      id
      date
      start
      end
      cost
      clientSub
      active
    }
  }
`;

const servicesQuery = gql`
  query Services($businessId: ID!, $page: Int!) {
    business(businessId: $businessId) {
      services(page: $page, pageSize: 10) {
        id
        name
        description
        active
      }
    }
  }
`;

const staffQuery = gql`
  query StaffOfBusiness($businessId: ID!, $page: Int!) {
    business(businessId: $businessId) {
      staff(page: $page, pageSize: 10) {
        content {
          id
          sub
          name
          description
          active
        }
        totalPages
      }
    }
  }
`;

const myInvitationsQuery = gql`
  query MyInvitations($page: Int!) {
    myInvitations(page: $page, pageSize: 10) {
      content {
        id
        status
        createdAt
        business {
          name
        }
      }
      totalPages
    }
  }
`;

const invitationsOfBusinessQuery = gql`
  query InvitationsOfBusiness($businessId: ID!, $page: Int!) {
    business(businessId: $businessId) {
      staffInvitations(page: $page, pageSize: 10) {
        content {
          id
          status
          createdAt
          sub
        }
        totalPages
      }
    }
  }
`;

const cancelReservationMutation = gql`
  mutation CancelReservation($reservationId: ID!) {
    cancelReservation(reservationId: $reservationId) {
      id
    }
  }
`;

const restoreReservationMutation = gql`
  mutation RestoreReservation($reservationId: ID!) {
    restoreReservation(reservationId: $reservationId) {
      id
    }
  }
`;

const createBusinessMutation = gql`
  mutation CreateBusiness($input: BusinessInput!) {
    createBusiness(input: $input) {
      id
    }
  }
`;

const createServiceMutation = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
      id
    }
  }
`;

const inviteStaffMutation = gql`
  mutation InviteStaff($userSub: String!, $businessId: ID!) {
    inviteStaff(userSub: $userSub, businessId: $businessId) {
      id
    }
  }
`;

const removeStaffMutation = gql`
  mutation RemoveStaff($staffId: ID!) {
    removeStaff(staffId: $staffId) {
      id
    }
  }
`;

const acceptInvitationMutation = gql`
  mutation AcceptInvitation($invitationId: ID!) {
    acceptInvitation(invitationId: $invitationId) {
      id
    }
  }
`;

const declineInvitationMutation = gql`
  mutation DeclineInvitation($invitationId: ID!) {
    declineInvitation(invitationId: $invitationId) {
      id
    }
  }
`;

export default function ProfilePage() {
  const user = useAuthUser();
  const { withErrorAlert, withAlert } = useAlert();
  const client = useApolloClient();
  const [tab, setTab] = useState(0);

  const fetchBusinesses = async (page: number): Promise<Page<Business>> => {
    return withErrorAlert(() => client.query<{myBusinesses: Page<Business>}>({
          query: myBusinessesQuery,
          variables: {
            page: page - 1,
          },
        }).then((response) => response.data.myBusinesses)
    );
  }

  const reservationCancelHandler = async (reservationId: number) => {
    return withErrorAlert(() => withAlert(() => client.mutate({
            mutation: cancelReservationMutation,
            variables: {
              reservationId: reservationId
            }
          }),
          "Запись отменена",
          "success"
        ).then(() => {})
    );
  }

  const reservationRestoreHandler = async (reservationId: number) => {
    return withErrorAlert(() => withAlert(() => client.mutate({
            mutation: restoreReservationMutation,
            variables: {
              reservationId: reservationId
            }
          }),
          "Запись восстановлена",
          "success"
        ).then(() => {})
    );
  }

  const myReservationsFetcher = async (from: LocalDate, to: LocalDate): Promise<Map<LocalDate, Reservation[]>> => {
    return withErrorAlert(() => client.query<{myReservations: Reservation[]}>({
        query: myReservationsQuery,
        variables: {
          from: from,
          to: to,
        },
      }).then((response) => response.data)
        .then((result) => groupBy(result.myReservations, reservation => reservation.date!))
    );
  }

  const reservationsToMeFetcher = async (from: LocalDate, to: LocalDate): Promise<Map<LocalDate, Reservation[]>> => {
    return withErrorAlert(() => client.query<{reservationsToMe: Reservation[]}>({
        query: reservationsToMeQuery,
        variables: {
          from: from,
          to: to,
        },
      }).then((response) => response.data)
        .then((result) => groupBy(result.reservationsToMe, reservation => reservation.date!))
    );
  }

  const businessCreationHandler = async (formData: BusinessFormData): Promise<void> => {
    return withErrorAlert(() => withAlert(() => client.mutate<Business>({
            mutation: createBusinessMutation,
            variables: {
              input: formData
            }
          }),
          "Бизнес создан",
          "success"
        ).then(() => {})
    );
  }

  const serviceCreationHandler = async (formData: ServiceFormData): Promise<void> => {
    return withErrorAlert(() => withAlert(() => client.mutate<Service>({
          mutation: createServiceMutation,
          variables: {
            input: formData
          }
        }),
        "Услуга создана",
        "success"
      ).then(() => {})
    );
  }

  const servicesOfBusinessFetcher = async (business: Business, name: string, page: number): Promise<Page<Service>> => {
    return withErrorAlert(() => client.query<{business: {services: Page<Service>}}>({
          query: servicesQuery,
          variables: {
            businessId: business.id,
            page: page - 1
          },
        })
        .then((response) => response.data)
        .then(result => {
          result.business.services.content.forEach(service => service.business = business);
          return result.business.services;
        })
    );
  }

  const staffOfBusinessFetcher = async (business: Business, page: number): Promise<Page<Staff>> => {
    return withErrorAlert(() => client.query<{business: {staff: Page<Staff>}}>({
          query: staffQuery,
          variables: {
            businessId: business.id,
            page: page - 1
          },
        })
        .then((response) => response.data)
        .then(result => {
          result.business.staff.content.forEach(staff => staff.business = business);
          return result.business.staff;
        })
    );
  }

  const staffInvitationHandler = async (subject: string, business: Business): Promise<void> => {
    return withErrorAlert(() => withAlert(() => client.mutate({
          mutation: inviteStaffMutation,
          variables: {
            userSub: subject,
            businessId: business.id
          }
        }),
        "Пользователь приглашён",
        "success"
      ).then(() => {})
    );
  }

  const staffRemovalHandler = async (staff: Staff): Promise<void> => {
    return withErrorAlert(() => withAlert(() => client.mutate({
          mutation: removeStaffMutation,
          variables: {
            staffId: staff.id
          }
        }),
        "Сотрудник ликвидирован",
        "success"
      ).then(() => {})
    );
  }

  async function acceptInvitationHandler(invitation: StaffInvitation): Promise<void> {
    return withErrorAlert(() => withAlert(() => client.mutate({
          mutation: acceptInvitationMutation,
          variables: {
            invitationId: invitation.id
          }
        }),
        "Приглашение принято",
        "success"
      ).then(() => {})
    );
  }

  const declineInvitationHandler = async (invitation: StaffInvitation): Promise<void> => {
    return withErrorAlert(() => withAlert(() => client.mutate({
          mutation: declineInvitationMutation,
          variables: {
            invitationId: invitation.id
          }
        }),
        "Приглашение отклонено",
        "success"
      ).then(() => {})
    );
  }

  const myInvitationsFetcher = async (page: number): Promise<Page<StaffInvitation>> => {
    return withErrorAlert(() => client.query<{myInvitations: Page<StaffInvitation>}>({
          query: myInvitationsQuery,
          variables: {
            page: page - 1
          },
        })
        .then((response) => response.data.myInvitations)
    );
  }
  
  const invitationsOfBusinessFetcher = async (business: Business, page: number): Promise<Page<StaffInvitation>> => {
    return withErrorAlert(() => client.query<{business: {staffInvitations: Page<StaffInvitation>}}>({
          query: invitationsOfBusinessQuery,
          variables: {
            businessId: business.id,
            page: page - 1
          },
        })
        .then((response) => response.data)
        .then(result => {
          result.business.staffInvitations.content.forEach(staffInvitation => staffInvitation.business = business);
          return result.business.staffInvitations;
        })
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
              servicePageSupplier={servicesOfBusinessFetcher}
              staffPageSupplier={staffOfBusinessFetcher}
              invitationPageSupplier={invitationsOfBusinessFetcher}
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
              reservationsSupplier={myReservationsFetcher}
              CardComponent={ReservationCard}
            />
          )}
          {tab === 2 && (
            <ProfileReservationsTab
              cancelHandler={reservationCancelHandler}
              restoreHandler={reservationRestoreHandler}
              reservationsSupplier={reservationsToMeFetcher}
              CardComponent={ReservationFromClientCard}
            />
          )}
          {tab === 3 && (
            <ProfileInvitationTab
              pageSupplier={myInvitationsFetcher}
              acceptHandler={acceptInvitationHandler}
              declineHandler={declineInvitationHandler}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

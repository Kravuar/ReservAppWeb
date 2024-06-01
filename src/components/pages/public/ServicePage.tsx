import { useState } from "react";
import { Service } from "../../../domain/Service";
import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";
import { useAlert } from "../../util/Alert";
import ServiceCard from "../../parts/ServiceCard";
import ServiceScheduleTab from "../../parts/ServiceScheduleTab";
import StaffScheduleTab from "../../parts/StaffScheduleTab";
import gql from "graphql-tag";
import { useApolloClient, useQuery } from "@apollo/client";
import { ReservationSlot } from "../../../domain/Schedule";
import { Staff } from "../../../domain/Staff";
import { Page } from "../../../domain/Page";
import { groupBy } from "../../../services/utils";

const serviceQuery = gql`
  {
    service(serviceId: $serviceId) {
      id
      name
      business {
        name
        ownerSub
      }
      active
      description
    }
  }
`;

const serviceScheduleQuery = gql`
  {
    service(serviceId: $serviceId) {
      schedule(from: $from, to: $to) {
        date
        start
        end
        cost
        maxReservations
        reservationsLeft
        staff {
          name
        }
      }
    }
  }
`;

const staffScheduleQuery = gql`
  {
    staff(staffId: $staffId) {
      name
      schedule(serviceId: $serviceId, from: $from, to: $to) {
        date
        start
        end
        cost
        maxReservations
        reservationsLeft
      }
    }
  }
`;

const staffQuery = gql`
  {
    business(businessId: $businessId) {
      staff(page: $page, pageSize: $pageSize) {
        id
        sub
        name
      }
    }
  }
`;

const reserveMutation = gql`
  mutation {
    reserveSlot(dateTime: $dateTime, staffId: $staffId, serviceId: $serviceId) {
      id
    }
  }
`;

export default function ServicePage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withAlert, withErrorAlert } = useAlert();
  const client = useApolloClient();
  const {loading: loadingService, error: serviceError, data: service} = useQuery<Service>(serviceQuery, { variables: { id: id } });
  const [tab, setTab] = useState(0);

  if (service) {
    const staffScheduleSupplier = async (staffId: number, from: LocalDate, to: LocalDate) => {
      return withErrorAlert(() => client.query<Staff>({
            query: staffScheduleQuery,
            variables: {
              serviceId: id,
              staffId: staffId,
              from: from,
              to: to,
            },
          })
          .then((response) => response.data)
          .then((fetchedStaff) => {
            fetchedStaff.schedule!.forEach((slot) => (slot.staff = fetchedStaff));
            return groupBy(fetchedStaff.schedule!, slot => slot.date!);
          })
      );
    };
  
    const serviceScheduleSupplier = async (from: LocalDate, to: LocalDate) => {
      return withErrorAlert(() => client.query<{schedule: ReservationSlot[]}>({
            query: serviceScheduleQuery,
            variables: {
              serviceId: id,
              from: from,
              to: to,
            },
          })
          .then((response) => response.data)
          .then((fetchedService) => {
            fetchedService.schedule!.forEach((slot) => (slot.service = service));
            return groupBy(fetchedService.schedule, slot => slot.date!);
          })
      );
    }

    const staffSupplier = async (page: number, pageSize: number) => {
      return withErrorAlert(() => client.query<{staff: Page<Staff>}>({
            query: staffQuery,
            variables: {
              businessId: service.business!.id,
              page: page,
              pageSize: pageSize
            },
          })
          .then((response) => response.data)
          .then((fetchedBusiness) => fetchedBusiness.staff)
      );
    }

    const reserveHandler = async (staffId: number, date: LocalDate, start: LocalTime) => {
      return withErrorAlert(() =>
        withAlert(
          () => client.mutate({
            mutation: reserveMutation,
            variables: {
              dateTime: LocalDateTime.of(date, start),
              staffId: staffId,
              serviceId: service.id
            }
          }),
          "Запись зарезирвирована",
          "success"
        ).then(() => {})
      );
    }

    return (
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <ServiceCard service={service} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Tabs
            variant="scrollable"
            value={tab}
            onChange={(_, value) => setTab(value)}
            sx={{ tabSize: 50 }}
          >
            <Tab label="Полное расписание" />
            <Tab label="Расписание по сотрудникам" />
            <Tab label="Отзывы" />
          </Tabs>
          <Box sx={{ padding: 3 }}>
            {tab === 0 && (
              <ServiceScheduleTab
                onReserve={reserveHandler}
                scheduleSupplier={serviceScheduleSupplier}
              />
            )}
            {tab === 1 && (
              <StaffScheduleTab
                onReserve={reserveHandler}
                scheduleSupplier={staffScheduleSupplier}
                staffSupplier={staffSupplier}
              />
            )}
            {/* TODO: Reviews tab */}
            {tab === 2 && <div>Тут должны быть отзывы</div>}
          </Box>
        </Box>
      </Box>
    );
  } else if (loadingService) return <SkeletonBody />;
    else return <ErrorPage message={serviceError!.message} />;
}

function SkeletonBody() {
  return (
    <Box>
      {Array.from(Array(10)).map((_, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box ml={2} flex={1}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          <Skeleton variant="text" width={80} />
        </Box>
      ))}
    </Box>
  );
}

import { useState } from "react";
import { Box, Card, CardContent, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { useAlert } from "../../util/Alert";
import { Staff } from "../../../domain/Staff";
import StaffCard from "../../parts/StaffCard";
import { Schedule, ScheduleFormData } from "../../../domain/Schedule";
import { Service } from "../../../domain/Service";
import { Page } from "../../../domain/Page";
import CardTabs from "../../parts/CardTabs";
import SimpleServiceCard from "../../parts/SimpleServiceCard";
import ManagedStaffScheduleTab from "../../parts/ManagedStaffScheduleTab";
import { gql, useApolloClient, useQuery } from "@apollo/client";

const staffQuery = gql`
  query Staff($staffId: ID!) {
    staff(staffId: $staffId) {
      id
      sub
      name
      description
      business {
        id
        name
        description
      }
    }
  }
`;

const scheduleQuery = gql`
  query StaffSchedule($staffId: ID!, $serviceId: ID!) {
    staff(staffId: $staffId) {
      activeSchedules(serviceId: $serviceId) {
        id
        start
        end
        createdAt
        patterns {
          repeatDays
          pauseDays
          slots {
            start
            end
            cost
            maxReservations
          }
        }
      }
    }
  }
`;

const servicesQuery = gql`
  query ServicesOfBusinessTrimmed($businessId: ID!, $page: Int!) {
    business(businessId: $businessId) {
      services(page: $page, pageSize: 10) {
        content {
          id
          name
          description
          active
        }
        totalPages
      }
    }
  }
`;

const scheduleCreationMutation = gql`
  query CreateSchedule($serviceId: ID!, $staffId: ID!, $input: ScheduleInput!) {
    createSchedule(serviceId: $serviceId, staffId: $staffId, input: $input) {
      id
    }
  }
`;

export default function StaffPage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withAlert, withErrorAlert } = useAlert();
  const {loading, error, data} = useQuery<{staff: Staff}>(staffQuery, {variables: {staffId: id}});
  const staff = data?.staff;
  const client = useApolloClient();
  const [service, setService] = useState<Service>();
  const [schedules, setSchedule] = useState<Schedule[]>([]);

  if (staff) {
    const servicesOfBusinessFetcher = async (page: number): Promise<Page<Service>> => {
      return withErrorAlert(() => client.query<{business: {services: Page<Service>}}>({
            query: servicesQuery,
            variables: {
              businessId: staff.business!.id!,
              page: page - 1
            },
          })
          .then((response) => response.data)
          .then(result => {
            result.business.services.content.forEach(service => service.business = staff.business!);
            return result.business.services;
          })
      );
    }

    const scheduleOfStaffFetcher = async (service: Service): Promise<Schedule[]> => {
      return withErrorAlert(() => client.query<{staff: {activeSchedules: Schedule[]}}>({
            query: scheduleQuery,
            variables: {
              staffId: staff.id!,
              serviceId: service.id!
            },
          })
          .then((response) => response.data)
          .then(result => {
            result.staff.activeSchedules.forEach(schedule => {
              schedule.service = service;
              schedule.staff = staff;
            });
            return result.staff.activeSchedules;
          })
      );
    }

    const handleServiceSelect = async (service: Service) => {
      setService(service);
      scheduleOfStaffFetcher(service)
        .then(setSchedule)
        .catch(() => {});
    }

    const scheduleCreationHandler = async (formData: ScheduleFormData) => {
      return withErrorAlert(async () => {
        if (service) {
          await withAlert(() => client.mutate({
            mutation: scheduleCreationMutation,
            variables: {
              serviceId: service.id!,
              staffId: staff.id!,
              input: formData
            }
          }),
            "Расписание создано",
            "success"
          );
        } else {
          return Promise.reject("Услуга не выбрана")
        }
      });
    }

    return (
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <StaffCard staff={staff} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardTabs
            pageSupplier={servicesOfBusinessFetcher}
            CardComponent={(props) => (
              <SimpleServiceCard service={props.item} />
            )}
            selectHandler={handleServiceSelect}
            horizontal
          />
          <Box mt={3}>
            <ManagedStaffScheduleTab
              schedules={schedules}
              scheduleCreationHandler={scheduleCreationHandler}
            />
          </Box>
        </Box>
      </Box>
    );
  } else if (loading) return <SkeletonBody />;
    else return <ErrorPage message={error!.message} />;
}

function SkeletonBody() {
  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      <Skeleton
        variant="rectangular"
        sx={{ width: "10%", padding: 2, borderRadius: 10 }}
      />
      <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
        <CardContent sx={{ flex: "1 0 auto", position: "relative" }}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Skeleton variant="text" width="60%" />
            <Skeleton
              variant="rectangular"
              width={100}
              height={30}
              sx={{ ms: 5 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

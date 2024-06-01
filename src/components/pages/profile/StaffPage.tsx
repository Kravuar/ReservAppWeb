import { useEffect, useState } from "react";
import { Box, Card, CardContent, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { useAlert } from "../../util/Alert";
import { Staff } from "../../../domain/Staff";
import StaffCard from "../../parts/StaffCard";
import {
  getActiveScheduleOfStaffAndService as activeScheduleOfStaffAndService,
  createSchedule,
  servicesByBusiness,
  staffById,
} from "../../../services/api";
import { Schedule, ScheduleFormData } from "../../../domain/Schedule";
import { Service, Service } from "../../../domain/Service";
import { Page } from "../../../domain/Page";
import CardTabs from "../../parts/CardTabs";
import SimpleServiceCard from "../../parts/SimpleServiceCard";
import ManagedStaffScheduleTab from "../../parts/ManagedStaffScheduleTab";

export default function StaffPage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withAlert, withErrorAlert } = useAlert();
  const [staff, setStaff] = useState<Staff>();
  const [service, setService] = useState<Service>();
  const [schedules, setSchedule] = useState<Schedule[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Номер сотрудника обязателен");
      return;
    }
    staffById(id)
      .then(setStaff)
      .catch((error) => setError(error));
  }, [id]);

  async function scheduleSupplier(serviceId: number): Promise<Schedule[]> {
    return withErrorAlert(() =>
      activeScheduleOfStaffAndService(staff!.id, serviceId)
    );
  }

  async function serviceSupplier(page: number): Promise<Page<Service>> {
    return withErrorAlert(() =>
      servicesByBusiness(staff!.business.id, page, 10)
    );
  }

  async function handleServiceSelect(service: Service) {
    setService(service);
    scheduleSupplier(service.id)
      .then(setSchedule)
      .catch(() => {});
  }

  async function handleScheduleCreation(formData: ScheduleFormData) {
    return withAlert(
      () =>
        withErrorAlert(() => createSchedule(service!.id, staff!.id, formData)),
      "Расписание создано",
      "success"
    );
  }

  if (staff) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <StaffCard staff={staff} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardTabs
            pageSupplier={serviceSupplier}
            CardComponent={(props) => (
              <SimpleServiceCard service={props.item} />
            )}
            selectHandler={handleServiceSelect}
            horizontal
          />
          <Box mt={3}>
            <ManagedStaffScheduleTab
              schedules={schedules}
              scheduleCreationHandler={handleScheduleCreation}
            />
          </Box>
        </Box>
      </Box>
    );
  } else if (error) return <ErrorPage message={error} />;
  else return <SkeletonBody />;
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

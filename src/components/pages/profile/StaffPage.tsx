import { useEffect, useState } from "react";
import { Box, Card, CardContent, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { useAlert } from "../../util/Alert";
import { Staff } from "../../../domain/Staff";
import StaffCard from "../../parts/StaffCard";
import {
  getActiveScheduleOfStaffAndService as activeScheduleOfStaffAndService,
  servicesByBusiness,
  staffById,
} from "../../../services/api";
import { Schedule } from "../../../domain/Schedule";
import { Service, ServiceDetailed } from "../../../domain/Service";
import { Page } from "../../../domain/Page";

export default function StaffPage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withAlert, withErrorAlert } = useAlert();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [schedule, setSchedule] = useState<Schedule[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Номер услуги обязателен");
      return;
    }
    staffById(id)
      .then(setStaff)
      .catch((error) => setError(error));
  }, [id]);

  async function scheduleSupplier(): Promise<Schedule[]> {
    if (staff)
      return withErrorAlert(() =>
        activeScheduleOfStaffAndService(staff.id, serviceId)
      );
    return [];
  }

  async function serviceSupplier(page: number): Promise<ServiceDetailed[]> {
    return withErrorAlert(() =>
      servicesByBusiness(staff.business.id, page, 10)
    );
  }

  if (staff) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <StaffCard staff={staff} />
        <Box sx={{ display: "flex", flexDirection: "column" }}></Box>
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
            <Skeleton variant="rectangular" width={100} height={30} />
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

function ServiceTabs({
  serviceSupplier,
  onSelect,
}: {
  serviceSupplier: (page: number) => Page<ServiceDetailed>;
  onSelect: (serviceId: number) => void;
}) {
  

  return (
    <Tabs
      value={staff.id}
      onChange={(_, newStaffId) => handleStaffChange(newStaffId)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="staff tabs"
      orientation="vertical"
    >
      {staffList?.content.map((staff) => (
        <Tab
          label={staff.name}
          value={staff.id}
          key={staff.id}
          icon={<Avatar src={staff.picture} />}
        />
      ))}
    </Tabs>
  );
}

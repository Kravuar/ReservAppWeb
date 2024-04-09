import { useEffect, useState } from "react";
import { ServiceDetailed } from "../../../domain/Service";
import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import {
  reserveSlot,
  scheduleByService,
  scheduleByServiceAndStaff,
  detailedServiceById,
  staffByBusinessId,
} from "../../../services/api";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";
import { useAlert } from "../../util/Alert";
import ServiceCard from "../../parts/ServiceCard";
import ServiceScheduleTab from "../../parts/ServiceScheduleTab";
import StaffScheduleTab from "../../parts/StaffScheduleTab";

export default function ServicePage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withAlert, withErrorAlert } = useAlert();
  const [service, setService] = useState<ServiceDetailed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Номер услуги обязателен");
      return;
    }
    detailedServiceById(id)
      .then(setService)
      .catch((error) => setError(error));
  }, [id]);

  function staffScheduleSupplier(
    staffId: number,
    from: LocalDate,
    to: LocalDate
  ) {
    return withErrorAlert(() =>
      scheduleByServiceAndStaff(id, staffId, from, to)
    );
  }

  function serviceScheduleSupplier(from: LocalDate, to: LocalDate) {
    return withErrorAlert(() => scheduleByService(id, from, to));
  }

  function staffSupplier(page: number, pageSize: number) {
    return withErrorAlert(() =>
      staffByBusinessId(service!.business.id, page, pageSize)
    );
  }

  function reserveHandler(staffId: number, date: LocalDate, start: LocalTime) {
    return withErrorAlert(() =>
      withAlert(
        () => reserveSlot(staffId, service!.id, LocalDateTime.of(date, start)),
        "Запись зарезирвирована",
        "success"
      )
    );
  }

  if (service)
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
  else if (error) return <ErrorPage message={error} />;
  else return <SkeletonBody />;
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

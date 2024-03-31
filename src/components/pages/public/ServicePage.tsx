import { useEffect, useState } from "react";
import ServiceBody from "../../parts/ServiceBody";
import { ServiceDetailed } from "../../../domain/Service";
import { Box, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { reserveSlot, scheduleByService, scheduleByServiceAndStaff, serviceById, staffByBusinessId } from "../../../services/api";
import { LocalDateTime } from "@js-joda/core";
import { useAlert } from "../../util/Alert";

export default function ServicePage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withAlert, withErrorAlert } = useAlert();
  const [service, setService] = useState<ServiceDetailed | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Номер услуги обязателен");
      return;
    }
    serviceById(id)
      .then(setService)
      .catch((error) => setError(error));
  }, [id]);

  if (service)
    return (
      <ServiceBody
        service={service}
        staffScheduleSupplier={(staffId, from, to) => withErrorAlert(() => scheduleByServiceAndStaff(id, staffId, from, to))}
        serviceScheduleSupplier={(from, to) => withErrorAlert(() => scheduleByService(id, from, to))}
        staffSupplier={(page, pageSize) => withErrorAlert(() => staffByBusinessId(service.business.id, page, pageSize))}
        onReserve={(staffId, date, start) => withErrorAlert(() => withAlert(() => reserveSlot(staffId, service.id, LocalDateTime.of(date, start)), "Запись зарезирвирована", "success"))}
      />
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

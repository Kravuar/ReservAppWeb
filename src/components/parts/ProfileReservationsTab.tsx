import { LocalDate } from "@js-joda/core";
import { Reservation } from "../../domain/Schedule";
import ReservationBody, { ReservationCardProps } from "./ReservationsBody";
import { Box } from "@mui/material";
import { useState } from "react";
import WeekSelector from "./WeekSelector";

export default function ProfileReservationsTab<ReservationType extends Reservation>({
  cancelHandler,
  restoreHandler,
  reservationsSupplier,
  CardComponent
}: {
  cancelHandler: (reservationId: number) => Promise<void>;
  restoreHandler: (reservationId: number) => Promise<void>;
  reservationsSupplier: (
    from: LocalDate,
    to: LocalDate
  ) => Promise<Map<LocalDate, ReservationType[]>>;
  CardComponent: React.ComponentType<ReservationCardProps<ReservationType>>;
}) {
  const [selectedDate, setSelectedDate] = useState<LocalDate>(LocalDate.now());
  const [schedule, setSchedule] = useState<
    Map<LocalDate, ReservationType[]>
  >(new Map());

  function handleWeekChange(
    newSelectedDate: LocalDate,
    newStartOfWeek: LocalDate,
    newEndOfWeek: LocalDate
  ) {
    setSelectedDate(newSelectedDate);
    reservationsSupplier(newStartOfWeek, newEndOfWeek)
      .then(setSchedule)
      .catch(() => {});
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <WeekSelector onAccept={handleWeekChange} date={selectedDate} />
      <ReservationBody
        schedule={schedule}
        cancelHandler={cancelHandler}
        restoreHandler={restoreHandler}
        CardComponent={CardComponent}
      />
    </Box>
  );
}

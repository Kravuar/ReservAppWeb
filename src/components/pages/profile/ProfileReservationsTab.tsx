import { LocalDate } from "@js-joda/core";
import { ReservationDetailed } from "../../../domain/Schedule";
import ReservationBody from "../../parts/ReservationsBody";
import { Box } from "@mui/material";
import { useState } from "react";
import WeekSelector from "../../parts/WeekSelector";

export default function ProfileReservationsTab({
  onCancelReservation,
  onReservationRestore,
  reservationsSupplier,
}: {
  onCancelReservation: (reservationId: number) => Promise<void>;
  onReservationRestore: (reservationId: number) => Promise<void>;
  reservationsSupplier: (
    from: LocalDate,
    to: LocalDate
  ) => Promise<Map<LocalDate, ReservationDetailed[]>>;
}) {
  const [selectedDate, setSelectedDate] = useState<LocalDate>(LocalDate.now());
  const [schedule, setSchedule] = useState<
    Map<LocalDate, ReservationDetailed[]>
  >(new Map());

  function handleWeekChange(
    newSelectedDate: LocalDate,
    newStartOfWeek: LocalDate,
    newEndOfWeek: LocalDate
  ) {
    setSelectedDate(newSelectedDate);
    reservationsSupplier(newStartOfWeek, newEndOfWeek)
      .then(setSchedule);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <WeekSelector onAccept={handleWeekChange} date={selectedDate} />
      <ReservationBody
        schedule={schedule}
        onCancelReservation={onCancelReservation}
        onReservationRestore={onReservationRestore}
      />
    </Box>
  );
}

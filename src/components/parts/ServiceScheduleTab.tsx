import { LocalDate } from "@js-joda/core";
import { useState } from "react";
import { Box } from "@mui/material";
import WeekSelector from "./WeekSelector";
import ScheduleBody, { ReserveAction } from "./ScheduleBody";
import { ReservationSlot } from "../../domain/Schedule";

export type ScheduleSupplier = (
  from: LocalDate,
  to: LocalDate
) => Promise<Map<LocalDate, ReservationSlot[]>>;

export default function ServiceScheduleTab({
  scheduleSupplier,
  onReserve
}: {
  scheduleSupplier: ScheduleSupplier;
  onReserve: ReserveAction;
}) {
  const [selectedDate, setSelectedDate] = useState<LocalDate>(LocalDate.now());
  const [schedule, setSchedule] = useState<
    Map<LocalDate, ReservationSlot[]>
  >(new Map());

  function handleWeekChange(
    newSelectedDate: LocalDate,
    newStartOfWeek: LocalDate,
    newEndOfWeek: LocalDate
  ) {
    setSelectedDate(newSelectedDate);
    scheduleSupplier(newStartOfWeek, newEndOfWeek)
      .then(setSchedule)
      .catch(() => {});
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <WeekSelector onAccept={handleWeekChange} date={selectedDate}/>
      {schedule && (
        <ScheduleBody onReserve={onReserve} schedule={schedule} showStaff/>
      )}
    </Box>
  );
}

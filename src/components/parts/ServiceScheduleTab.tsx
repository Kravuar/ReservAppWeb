import { DayOfWeek, LocalDate, TemporalAdjusters } from "@js-joda/core";
import { ReservationSlotDetailed } from "../../domain/Schedule";
import { useState, useEffect } from "react";
import { Refresh } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import WeekSelector from "./WeekSelector";
import ScheduleBody from "./ScheduleBody";

export type ScheduleSupplier = (
  from: LocalDate,
  to: LocalDate
) => Promise<Map<LocalDate, ReservationSlotDetailed[]>>;

export default function ServiceScheduleTab({
  scheduleSupplier,
}: {
  scheduleSupplier: ScheduleSupplier;
}) {
  const [selectedDate, setSelectedDate] = useState<LocalDate>(LocalDate.now());
  const [startOfWeek, setStartOfWeek] = useState<LocalDate>(
    selectedDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
  );
  const [endOfWeek, setEndOfWeek] = useState<LocalDate>(
    selectedDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
  );
  const [schedule, setSchedule] = useState<
    Map<LocalDate, ReservationSlotDetailed[]>
  >(new Map());

  useEffect(() => {
    scheduleSupplier(startOfWeek, endOfWeek)
      .then(setSchedule)
      .catch((error) => alert(error));
  }, [startOfWeek, endOfWeek, scheduleSupplier]);

  function handleWeekChange(
    newSelectedDate: LocalDate,
    newStartOfWeek: LocalDate,
    newEndOfWeek: LocalDate
  ) {
    setSelectedDate(newSelectedDate);
    setStartOfWeek(newStartOfWeek);
    setEndOfWeek(newEndOfWeek);
  }

  function handleRefresh() {
    scheduleSupplier(startOfWeek, endOfWeek)
      .then(setSchedule)
      .catch((error) => alert(error));
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <WeekSelector onAccept={handleRefresh} date={selectedDate} onChange={handleWeekChange} />
      {schedule && (
        <ScheduleBody schedule={schedule} />
      )}
    </Box>
  );
}

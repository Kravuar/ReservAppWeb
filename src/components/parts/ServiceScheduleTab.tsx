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
  const [startOfWeek, setStartOfWeek] = useState<LocalDate>(
    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
  );
  const [endOfWeek, setEndOfWeek] = useState<LocalDate>(
    LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
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
    newStartOfWeek: LocalDate,
    newEndOfWeek: LocalDate
  ) {
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
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <WeekSelector date={startOfWeek} onChange={handleWeekChange} />
        <IconButton
          edge="end"
          aria-label="refresh"
          aria-haspopup="true"
          onClick={handleRefresh}
          color="inherit"
        >
          <Refresh />
        </IconButton>
      </Box>
      {schedule && (
        <ScheduleBody schedule={schedule} />
      )}
    </Box>
  );
}

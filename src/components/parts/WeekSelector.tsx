import { useState } from "react";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { DayOfWeek, LocalDate, TemporalAdjusters } from "@js-joda/core";
import { DateTime } from "luxon";
import { Box, IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";

export type WeekChangeHandler = (
  selectedDate: LocalDate,
  startOfWeek: LocalDate,
  endOfWeek: LocalDate
) => void;

export default function WeekSelector({
  date,
  onAccept,
}: {
  date: LocalDate;
  onAccept: WeekChangeHandler;
}) {
  const [selectedDate, setSelectedDate] = useState<LocalDate>(date);

  function handleAccept() {
    onAccept(
      selectedDate,
      selectedDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
      selectedDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
    );
  }

  function handleDateChange(newDate: DateTime | null) {
    if (newDate) setSelectedDate(LocalDate.parse(newDate.toISODate()!));
  }

  return (
    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", mx: 2 }}>
      <IconButton
          aria-label="login"
          aria-haspopup="true"
          onClick={handleAccept}
          color="inherit"
        >
          <Refresh />
        </IconButton>
      <StaticDatePicker
        value={DateTime.fromISO(selectedDate.toString())}
        orientation="landscape"
        slotProps={{
          actionBar: {
            actions: [],
          },
        }}
        onChange={handleDateChange}
      />
    </Box>
  );
}

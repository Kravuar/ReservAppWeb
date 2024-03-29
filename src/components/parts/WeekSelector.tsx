import { useEffect, useState } from "react";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DayOfWeek, LocalDate, TemporalAdjusters } from "@js-joda/core";
import { DateTime } from "luxon";

export type WeekChangeHandler = (
  selectedDate: LocalDate,
  startOfWeek: LocalDate,
  endOfWeek: LocalDate
) => void;

export default function WeekSelector({
  date,
  onChange,
  onAccept
}: {
  date: LocalDate,
  onChange: WeekChangeHandler,
  onAccept: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<LocalDate>(date);
  const [startOfWeek, setStartOfWeek] = useState<LocalDate>(
    date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
  );
  const [endOfWeek, setEndOfWeek] = useState<LocalDate>(
    date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
  );

  useEffect(() => {
    onChange(selectedDate, startOfWeek, endOfWeek);
  }, [selectedDate, startOfWeek, endOfWeek, onChange]);

  function handleDateChange(newDate: DateTime | null) {
    if (newDate) {
      const date = LocalDate.parse(newDate.toISODate()!);
      setSelectedDate(date);
      setStartOfWeek(date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)));
      setEndOfWeek(date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)));
    }
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <StaticDatePicker
        value={DateTime.fromISO(date.toString())}
        onChange={handleDateChange}
        orientation="landscape"
        slotProps={{
          actionBar: {
            actions: ['accept'],
          },
        }}
        onAccept={(_) => onAccept()}
      />
    </LocalizationProvider>
  );
}

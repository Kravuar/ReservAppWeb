import { useEffect, useState } from "react";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DayOfWeek, LocalDate, TemporalAdjusters } from "@js-joda/core";
import dayjs, { Dayjs } from "dayjs";

export type WeekChangeHandler = (
  startOfWeek: LocalDate,
  endOfWeek: LocalDate
) => void;

export default function WeekSelector({
  date,
  onChange,
}: {
  date: LocalDate,
  onChange: WeekChangeHandler;
}) {
  const [startOfWeek, setStartOfWeek] = useState<LocalDate>(
    date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
  );
  const [endOfWeek, setEndOfWeek] = useState<LocalDate>(
    date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
  );

  useEffect(() => {
    onChange(startOfWeek, endOfWeek);
  }, [startOfWeek, endOfWeek, onChange]);

  function handleDateChange(newDate: Dayjs | null) {
    if (newDate) {
      const date = LocalDate.parse(newDate.toISOString());
      setStartOfWeek(
        date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
      );
      setEndOfWeek(date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)));
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        value={dayjs(startOfWeek.toString())}
        onChange={handleDateChange}
        orientation="landscape"
      />
    </LocalizationProvider>
  );
}

import { FormEvent, useState } from "react";
import { ChronoUnit, LocalTime } from "@js-joda/core";
import {
  TextField,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";
import { ReservationSlot } from "../../domain/Schedule";
import { TimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

export default function ReservationSlotForm({
  onSubmit,
}: {
  onSubmit: (slot: ReservationSlot) => Promise<void>;
}) {
  const [start, setStart] = useState<LocalTime>(LocalTime.now().truncatedTo(ChronoUnit.MINUTES));
  const [end, setEnd] = useState<LocalTime>(LocalTime.now().truncatedTo(ChronoUnit.MINUTES));
  const [cost, setCost] = useState<number>(0);
  const [maxReservations, setMaxReservations] = useState<number>(0);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(new ReservationSlot(start, end, cost, maxReservations))
    .catch(() => {});
  };

  function parseTime(time: DateTime | null, setter: React.Dispatch<React.SetStateAction<LocalTime>>) {
    if (time) 
      setter(LocalTime.of(time.hour, time.minute));
  }

  return (
    <Card
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TimePicker
            label="Начало"
            value={DateTime.fromISO(start.toString())}
            onChange={(newStart) => parseTime(newStart, setStart)}
            views={["hours", "minutes"]}
            sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 2 } }}
          />
          <TimePicker
            label="Конец"
            value={DateTime.fromISO(end.toString())}
            onChange={(newEnd) => parseTime(newEnd, setEnd)}
            views={["hours", "minutes"]}
            sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 2 } }}
          />
          <TextField
            label="Цена"
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 2 } }}
          />
          <TextField
            label="Максимум записей"
            type="number"
            value={maxReservations}
            onChange={(e) => setMaxReservations(Number(e.target.value))}
            sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 2 } }}
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button type="submit" variant="contained" fullWidth sx={{backgroundColor: "success.dark"}}>
          Добавить место
        </Button>
      </CardActions>
    </Card>
  );
}

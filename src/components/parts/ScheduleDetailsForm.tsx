import { FormEvent, useState } from "react";
import { Card, CardContent, CardActions, Button, Box } from "@mui/material";
import { LocalDate } from "@js-joda/core";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

export class ScheduleDetailsFormData {
  constructor(public start: LocalDate, public end: LocalDate) {}
}

export default function ScheduleDetailsForm({
  onSubmit,
}: {
  onSubmit: (schedule: ScheduleDetailsFormData) => Promise<void>;
}) {
  const [start, setStart] = useState<LocalDate>(LocalDate.now());
  const [end, setEnd] = useState<LocalDate>(LocalDate.now());

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(new ScheduleDetailsFormData(start, end))
      .then(() => {
        setStart(end);
        setEnd(end);
      })
      .catch(() => {});
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
          sx={{ display: "flex",flexDirection: "column" }}
        >
          <DatePicker
            label="Начало"
            value={DateTime.fromISO(start.toString())}
            onChange={(newStart) => {
              if (newStart) setStart(LocalDate.parse(newStart.toISODate()!));
            }}
            sx={{ mb: 2 }}
          />
          <DatePicker
            label="Конец"
            value={DateTime.fromISO(end.toString())}
            onChange={(newEnd) => {
              if (newEnd) setEnd(LocalDate.parse(newEnd.toISODate()!));
            }}
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "success.dark" }}
        >
          Создать
        </Button>
      </CardActions>
    </Card>
  );
}

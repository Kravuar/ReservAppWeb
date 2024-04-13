import { FormEvent, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";

export class SchedulePatternDetailsFormData {
  constructor(public repeatDays: number, public pauseDays: number) {}
}

export default function SchedulePatternDetailsForm({
  onSubmit,
}: {
  onSubmit: (pattern: SchedulePatternDetailsFormData) => Promise<void>;
}) {
  const [repeatDays, setRepeatDays] = useState<number>(0);
  const [pauseDays, setPauseDays] = useState<number>(0);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(new SchedulePatternDetailsFormData(repeatDays, pauseDays));
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
        <Box sx={{ display: "flex",flexDirection: "column" }}>
          <TextField
            label="Повторений"
            type="number"
            value={repeatDays}
            onChange={(e) => setRepeatDays(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Пауза"
            type="number"
            value={pauseDays}
            onChange={(e) => setPauseDays(Number(e.target.value))}
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: "success.dark"}}
        >
          Добавить шаблон
        </Button>
      </CardActions>
    </Card>
  );
}

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Typography,
} from "@mui/material";
import { Schedule } from "../../domain/Schedule";
import SchedulePatternCard from "./SchedulePatternCard";

export default function ScheduleCard({ schedule }: { schedule: Schedule }) {
  const [open, setOpen] = useState(false);

  return (
    <Card sx={{ marginBottom: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component="div"
          marginTop={1}
        >
          Период: {schedule.start.toString()} - {schedule.end.toString()}
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(!open)}
            sx={{ my: 1, px: 3, borderRadius: "10", display: "flex", width: 1 }}
          >
            {open ? "Скрыть" : "Показать шаблон"}
          </Button>
        </Box>
        <Collapse in={open}>
          {schedule.patterns.map((pattern) => (
            <SchedulePatternCard key={pattern.id} pattern={pattern} />
          ))}
        </Collapse>
      </CardContent>
    </Card>
  );
}
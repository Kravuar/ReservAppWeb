import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Collapse,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { SchedulePattern } from "../../domain/Schedule";
import SimpleReservationSlotCard from "./SimpleReservationSlotCard";

export default function SchedulePatternCard({ pattern }: { pattern: SchedulePattern }) {
  const [slotsOpen, setSlotsOpen] = useState(false);

  return (
    <Card sx={{ marginTop: 2, boxShadow: 1 }}>
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component="div"
          marginTop={1}
        >
          Рабочие дни: {pattern.repeatDays}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component="div"
          marginTop={1}
        >
          Затем, Выходные: {pattern.pauseDays}
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSlotsOpen(!slotsOpen)}
            sx={{
              my: 1,
              px: 3,
              borderRadius: "10",
              display: "flex",
              width: 1,
            }}
          >
            {slotsOpen ? "Скрыть" : "Показать места для записи"}
          </Button>
        </Box>
        <Collapse in={slotsOpen}>
          <Grid container spacing={2}>
            {pattern.reservationSlots.map((slot, slotIndex) => (
              <Grid item xs={12} sm={6} md={4} key={slotIndex}>
                <SimpleReservationSlotCard reservationSlot={slot} />
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
}

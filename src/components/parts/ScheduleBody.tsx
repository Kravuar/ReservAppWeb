import { LocalDate, LocalTime } from "@js-joda/core";
import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import ReservationSlotCard from "./ReservationSlotCard";

export type ReserveAction = (
  staffId: number,
  date: LocalDate,
  start: LocalTime
) => Promise<void>;

export default function ScheduleBody({
  schedule,
  showStaff,
  onReserve,
}: {
  schedule: Map<LocalDate, ReservationSlotDetailed[]>;
  onReserve: ReserveAction;
  showStaff?: boolean;
}) {
  async function reserveHandler(date: LocalDate, slot: ReservationSlotDetailed): Promise<void> {
    return onReserve(slot.staff.id, date, slot.start);
  }

  return (
    <Box>
      {Array.from(schedule.entries()).map(([date, slots], index) => (
        <Card key={index} sx={{ my: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: slots.length ? "primary.main" : "warning.main",
                color: slots.length
                  ? "primary.contrastText"
                  : "warning.contrastText",
                py: 1,
                borderRadius: 1,
              }}
            >
              {date.dayOfWeek().toString()}, {date.month().toString()}{" "}
              {date.dayOfMonth()}
            </Typography>
            {slots && (
              <Grid container spacing={2}>
                {slots.map((slot, slotIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={slotIndex}>
                    <ReservationSlotCard
                      onReserve={() => reserveHandler(date, slot)}
                      reservationSlot={slot}
                      showStaff={showStaff}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

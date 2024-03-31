import { LocalDate, LocalTime } from "@js-joda/core";
import { ReservationDetailed } from "../../domain/Schedule";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import ReservationCard from "./ReservationCard";

export type ReserveAction = (
  staffId: number,
  date: LocalDate,
  start: LocalTime
) => Promise<void>;

export default function ReservationBody({
  schedule,
  onCancelReservation,
  onReservationRestore
}: {
  schedule: Map<LocalDate, ReservationDetailed[]>;
  onCancelReservation: (reservationId: number) => Promise<void>;
  onReservationRestore: (reservationId: number) => Promise<void>;
}) {
  return (
    <Box>
      {Array.from(schedule.entries()).map(([date, reservations], index) => (
        <Card key={index} sx={{ my: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: reservations.length ? "primary.main" : "secondary.main",
                color: reservations.length
                  ? "primary.contrastText"
                  : "secondary.contrastText",
                py: 1,
                borderRadius: 1,
              }}
            >
              {date.dayOfWeek().toString()}, {date.month().toString()}{" "}
              {date.dayOfMonth()}
            </Typography>
            {reservations && (
              <Grid container spacing={2}>
                {reservations.map((reservation, slotIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={slotIndex}>
                    <ReservationCard
                      reservation={reservation}
                      onCancelReservation={onCancelReservation}
                      onReservationRestore={onReservationRestore}
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

import { LocalDate, LocalTime } from "@js-joda/core";
import { Reservation } from "../../domain/Schedule";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

export type ReserveAction = (
  staffId: number,
  date: LocalDate,
  start: LocalTime
) => Promise<void>;

export type ReservationCardProps<T extends Reservation> = {
  reservation: T,
  cancelHandler: (reservationId: number) => Promise<void>;
  restoreHandler: (reservationId: number) => Promise<void>;
}

export default function ReservationBody<ReservationType extends Reservation>({
  schedule,
  cancelHandler,
  restoreHandler,
  CardComponent,
}: {
  schedule: Map<LocalDate, ReservationType[]>;
  cancelHandler: (reservationId: number) => Promise<void>;
  restoreHandler: (reservationId: number) => Promise<void>;
  CardComponent: React.ComponentType<ReservationCardProps<ReservationType>>;
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
                    <CardComponent
                      reservation={reservation}
                      cancelHandler={cancelHandler}
                      restoreHandler={restoreHandler}
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

import { LocalDate, LocalTime } from "@js-joda/core";
import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Box, Typography, Card, CardContent } from "@mui/material";
import ManagedReservationSlotsBody from "./ManagedReservationSlotsBody";

export type ReserveAction = (
  staffId: number,
  date: LocalDate,
  start: LocalTime
) => Promise<void>;

export default function ScheduleBody({
  schedule,
  onReserve,
  showStaff,
}: {
  schedule: Map<LocalDate, ReservationSlotDetailed[]>;
  onReserve: ReserveAction;
  showStaff: boolean;
}) {
  async function reserveHandler(
    date: LocalDate,
    slot: ReservationSlotDetailed
  ): Promise<void> {
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
              <ManagedReservationSlotsBody
                slots={slots}
                reserveHandler={(slot) => reserveHandler(date, slot)}
                showStaff={showStaff}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

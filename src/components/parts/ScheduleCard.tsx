import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Box } from "@mui/material";
import ReservationSlotCard from "./ReservationSlotCard";

export default function ScheduleCard({
  slots,
}: {
  slots: ReservationSlotDetailed[];
}) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" my={2}>
      {slots.map((slot, index) => (
        <Box key={index} width="100%" my={1}>
          <ReservationSlotCard reservationSlot={slot} />
        </Box>
      ))}
    </Box>
  );
}

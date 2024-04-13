import { ReservationSlot } from "../../domain/Schedule";
import { Grid } from "@mui/material";
import SimpleReservationSlotCard from "./SimpleReservationSlotCard";

export default function ReservationSlotsBody({
  slots,
}: {
  slots: ReservationSlot[];
}) {
  return (
    <Grid container spacing={2}>
      {slots.map((slot, slotIndex) => (
        <Grid item xs={12} sm={6} md={4} key={slotIndex}>
          <SimpleReservationSlotCard
            reservationSlot={slot}
          />
        </Grid>
      ))}
    </Grid>
  );
}

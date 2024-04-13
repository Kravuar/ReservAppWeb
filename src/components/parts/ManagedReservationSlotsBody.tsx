import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Grid } from "@mui/material";
import ReservationSlotCard from "./ReservationSlotCard";

export default function ManagedReservationSlotsBody({
  slots,
  reserveHandler,
  showStaff,
}: {
  slots: ReservationSlotDetailed[];
  reserveHandler: (slot: ReservationSlotDetailed) => Promise<void>;
  showStaff: boolean;
}) {
  return (
    <Grid container spacing={2}>
      {slots.map((slot, slotIndex) => (
        <Grid item xs={12} sm={6} md={4} key={slotIndex}>
          <ReservationSlotCard
            onReserve={() => reserveHandler(slot)}
            reservationSlot={slot}
            showStaff={showStaff}
          />
        </Grid>
      ))}
    </Grid>
  );
}

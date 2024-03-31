import { LocalDate } from "@js-joda/core";
import { Reservation } from "../../../domain/Schedule";
import { Typography } from "@mui/material";

export default function ProfileReservationsTab({
  onCancelReservation,
  reservationsSupplier
}: {
  onCancelReservation: (reservationId: number) => Promise<void>;
  reservationsSupplier: (from: LocalDate, to: LocalDate) => Promise<Map<LocalDate, Reservation[]>>;
}) {

  return (
    <Typography>Здесь должны быть записи от лица сотрудника</Typography>
  );
}

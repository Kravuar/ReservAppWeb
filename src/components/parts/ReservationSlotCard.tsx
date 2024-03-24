import { ReservationSlotDetailed } from "../../domain/Schedule";
import {
  Card,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";
import { AccessTime, Money, StarRate } from "@mui/icons-material";

export default function ReservationSlotCard({
  reservationSlot,
}: {
  reservationSlot: ReservationSlotDetailed;
}) {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        avatar={
          reservationSlot.staff && <Avatar aria-label="staff-picture" src={reservationSlot.staff.picture} />
        }
        title={reservationSlot.staff ? `Сотрудник: ${reservationSlot.staff.sub}` : "Окно"}
        subheader={
          reservationSlot.staff && (
            <Chip
              icon={<StarRate />}
              label={`${reservationSlot.staff.rating} Stars`}
              color="success"
            />
          )
        }
      />
      <Divider variant="middle" />
      <CardContent>
        <Typography
          variant="h6"
          color="textSecondary"
          component="p"
          gutterBottom
        >
          Time Slot:
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <AccessTime sx={{ mr: 1 }} />
          {`${reservationSlot.start.toString()} - ${reservationSlot.end.toString()}`}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <Money sx={{ mr: 1 }} />
          {`Стоимость: ${reservationSlot.cost}`}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {`Свободные места: ${reservationSlot.reservationsLeft}/${reservationSlot.maxReservations}`}
        </Typography>
      </CardContent>
      {reservationSlot.staff && (
        <CardMedia
          component="img"
          alt="Staff"
          height="140"
          image={reservationSlot.staff.picture}
          title="Сотрудник"
        />
      )}
    </Card>
  );
}

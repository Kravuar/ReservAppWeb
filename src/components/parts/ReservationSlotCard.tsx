import { ReservationSlotDetailed } from "../../domain/Schedule";
import {
  Card,
  CardHeader,
  Avatar,
  Divider,
  CardContent,
  Typography,
  Box,
  Rating,
  IconButton,
} from "@mui/material";
import {
  AccessTime,
  Check,
  CheckCircle,
  EditCalendar,
  Money,
} from "@mui/icons-material";

export default function ReservationSlotCard({
  reservationSlot,
  showStaff,
  onReserve,
}: {
  reservationSlot: ReservationSlotDetailed;
  onReserve: () => void;
  showStaff?: boolean;
}) {
  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        avatar={<EditCalendar />}
        title={
          showStaff && reservationSlot.staff ? (
            <Typography
              variant="h6"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Запись, {reservationSlot.staff.name}
            </Typography>
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Запись
            </Typography>
          )
        }
        subheader={
          reservationSlot.staff && (
            <Box display="flex" flexDirection={"row"} alignItems="center">
              <Avatar src={reservationSlot.staff.picture} />
              <Rating value={reservationSlot.staff.rating} readOnly />
            </Box>
          )
        }
      />
      <Divider variant="middle" />
      <CardContent>
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
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="body1" color="textSecondary">
            {`Свободные места: ${reservationSlot.reservationsLeft}/${reservationSlot.maxReservations}`}
          </Typography>
          <IconButton
            aria-label="reserve"
            aria-haspopup="true"
            onClick={onReserve}
            color={reservationSlot.reservationsLeft > 0 ? "inherit" : "warning"}
          >
            <CheckCircle />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

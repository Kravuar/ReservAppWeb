import { ReservationSlot } from "../../domain/Schedule";
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
  Skeleton,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  EditCalendar,
  Money,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function ReservationSlotCard({
  reservationSlot,
  showStaff,
  onReserve,
}: {
  reservationSlot: ReservationSlot;
  onReserve: () => Promise<void>;
  showStaff?: boolean;
}) {
  const [reservationsLeft, setReservationsLeft] = useState<number>(0);

  useEffect(
    () => setReservationsLeft(reservationSlot.reservationsLeft!),
    [reservationSlot]
  );

  function reserveHandler() {
    onReserve()
      .then(() => setReservationsLeft(reservationsLeft - 1))
      .catch(() => {});
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        avatar={<EditCalendar />}
        title={
          showStaff ? (
            <Typography
              variant="h6"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Запись, {reservationSlot.staff!.name}
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
              <Avatar src={reservationSlot.staff.picture} sx={{ mr: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
              </Avatar>
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
          {`${reservationSlot.start!.toString()} - ${reservationSlot.end!.toString()}`}
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
            {`Свободные места: ${reservationsLeft}/${reservationSlot.maxReservations}`}
          </Typography>
          <IconButton
            aria-label="reserve"
            aria-haspopup="true"
            onClick={reserveHandler}
            color={reservationsLeft > 0 ? "inherit" : "warning"}
          >
            <CheckCircle />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

import { ReservationDetailed } from "../../domain/Schedule";
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
  Cancel,
  EditCalendar,
  Restore,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function ReservationCard({
  reservation,
  onCancelReservation,
  onReservationRestore,
}: {
  reservation: ReservationDetailed;
  onCancelReservation: (reservationId: number) => Promise<void>;
  onReservationRestore: (reservationId: number) => Promise<void>;
}) {
  const [staffImageLoaded, setStaffImageLoaded] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(
    () => setEnabled(reservation.active),
    [reservation]
  );

  function cancelHandler() {
    onCancelReservation(reservation.id)
      .then(() => setEnabled(false))
      .catch(() => {});
  }

  function restoreHandler() {
    onReservationRestore(reservation.id)
      .then(() => setEnabled(true))
      .catch(() => {});
  }

  function handleReservationAction() {
    if (enabled)
      cancelHandler();
    else
      restoreHandler();
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        avatar={<EditCalendar />}
        title={
          <Typography
            variant="h6"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            Запись, {reservation.staff.name}
          </Typography>
        }
        subheader={
          reservation.staff && (
            <Box display="flex" flexDirection={"row"} alignItems="center">
              <Avatar
                src={reservation.staff.picture}
                slotProps={{
                  img: {
                    onLoad: () => setStaffImageLoaded(true),
                  },
                }}
              >
                {!staffImageLoaded && (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
              </Avatar>
              <Rating value={reservation.staff.rating} readOnly />
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
          {`${reservation.start.toString()} - ${reservation.end.toString()}`}
        </Typography>
        <IconButton
          aria-label="reserve"
          aria-haspopup="true"
          onClick={handleReservationAction}
          color="inherit"
        >
          {enabled 
            ? <Cancel color="error" />
            : <Restore color="success"/>
          }
        </IconButton>
      </CardContent>
    </Card>
  );
}

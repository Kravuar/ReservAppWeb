import { ReservationFromClientDetailed } from "../../domain/Schedule";
import {
  Card,
  CardHeader,
  Divider,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import {
  AccessTime,
  Cancel,
  EditCalendar,
  MiscellaneousServices,
  Restore,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ReservationFromClientCard({
  reservation,
  cancelHandler,
  restoreHandler,
}: {
  reservation: ReservationFromClientDetailed;
  cancelHandler: (reservationId: number) => Promise<void>;
  restoreHandler: (reservationId: number) => Promise<void>;
}) {
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => setEnabled(reservation.active), [reservation]);

  function handleReservationAction() {
    if (enabled)
      cancelHandler(reservation.id)
        .then(() => setEnabled(false))
        .catch(() => {});
    else
      restoreHandler(reservation.id)
        .then(() => setEnabled(true))
        .catch(() => {});
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        avatar={<EditCalendar />}
        title={
          <Box>
            <Typography
              variant="h6"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Запись от {reservation.clientSub}
            </Typography>
            <Typography
              variant="h6"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              На услугу
            </Typography>
          </Box>
        }
        subheader={
          <IconButton
            aria-label="service"
            aria-haspopup="true"
            component={Link}
            to={`/home/services/${reservation.service.id}`}
            color="inherit"
            sx={{ borderRadius: 0, px: 0 }}
          >
            <MiscellaneousServices sx={{ mr: 1 }} />
            <Typography variant="h6">
              {reservation.service.name}
            </Typography>
          </IconButton>
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
        <Box display="flex" justifyContent="flex-end">
          <IconButton
            aria-label="reserve"
            aria-haspopup="true"
            onClick={handleReservationAction}
            color="inherit"
          >
            {enabled ? <Cancel color="error" /> : <Restore color="success" />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

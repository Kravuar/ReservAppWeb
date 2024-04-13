import {
  Card,
  CardHeader,
  Divider,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import {
  AccessTime,
  EditCalendar,
  Money,
} from "@mui/icons-material";
import { ReservationSlot } from "../../domain/Schedule";
import { ChronoUnit } from "@js-joda/core";

export default function SimpleReservationSlotCard({
  reservationSlot,
}: {
  reservationSlot: ReservationSlot;
}) {
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
              Запись
            </Typography>
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
          {`${reservationSlot.start.truncatedTo(ChronoUnit.MINUTES).toString()} - ${reservationSlot.end.truncatedTo(ChronoUnit.MINUTES).toString()}`}
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
            {`Мест: ${reservationSlot.maxReservations}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

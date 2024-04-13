import { ReservationSlot } from "../../domain/Schedule";
import { Box, Grid, Button, Collapse, Typography } from "@mui/material";
import { useState } from "react";
import ReservationSlotForm from "./ReservationSlotForm";
import SimpleReservationSlotCard from "./SimpleReservationSlotCard";

export default function ScheduleReservationSlotsTab({
  slots,
  scheduleReservationSlotCreationHandler,
}: {
  slots: ReservationSlot[];
  scheduleReservationSlotCreationHandler: (
    formData: ReservationSlot
  ) => Promise<void>;
}) {
  const [open, setOpen] = useState<boolean>(false);

  async function onCreate(formData: ReservationSlot): Promise<void> {
    return scheduleReservationSlotCreationHandler(formData)
      .then()
      .catch((error) => error);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(!open)}
            sx={{ my: 2, mr: 1 }}
          >
            {open ? "Скрыть" : "Создать место для записи"}
          </Button>
        </Box>
        <Collapse in={open}>
          <ReservationSlotForm onSubmit={onCreate} />
        </Collapse>
      </Box>
      {slots.length > 0 ? (
        <Grid container rowSpacing={5} my={3} px={2}>
          {slots.map((slot, idx) => (
            <Grid item xs={12} key={idx}>
              <SimpleReservationSlotCard reservationSlot={slot} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textAlign: "center",
            backgroundColor: "warning.dark",
            color: "warning.contrastText",
            py: 1,
            borderRadius: 1,
          }}
        >
          Нет мест для записей
        </Typography>
      )}
    </Box>
  );
}

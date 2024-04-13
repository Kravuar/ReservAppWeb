import {
  ReservationSlot,
  SchedulePatternFormData,
} from "../../domain/Schedule";
import { Box, Grid, Button, Collapse, Typography } from "@mui/material";
import { useState } from "react";
import SchedulePatternDetailsForm, {
  SchedulePatternDetailsFormData,
} from "./SchedulePatternDetailsForm";
import SchedulePatternCard from "./SchedulePatternCard";
import ScheduleReservationSlotsTab from "./ReservationSlotTab";

type Pattern = {
  repeatDays: number;
  pauseDays: number;
  reservationSlots: ReservationSlot[];
};

export default function SchedulePatternsTab({
  patterns,
  schedulePatternCreationHandler,
}: {
  patterns: Pattern[];
  schedulePatternCreationHandler: (
    formData: SchedulePatternFormData
  ) => Promise<void>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [slots, setSlots] = useState<ReservationSlot[]>([]);

  async function onCreate(
    formData: SchedulePatternDetailsFormData
  ): Promise<void> {
    return schedulePatternCreationHandler({
      ...formData,
      reservationSlots: slots,
    })
      .then()
      .catch((error) => error);
  }

  function handleSlotCreation(slot: ReservationSlot): Promise<void> {
    setSlots([...slots, slot]);
    return Promise.resolve();
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
            {open ? "Скрыть" : "Создать шаблон"}
          </Button>
        </Box>
        <Collapse in={open}>
          <SchedulePatternDetailsForm onSubmit={onCreate} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "center",
              backgroundColor: "secondary.main",
              color: "secondary.contrastText",
              py: 1,
              borderRadius: 1,
            }}
          >
            Записи
          </Typography>
          <ScheduleReservationSlotsTab
            slots={slots}
            scheduleReservationSlotCreationHandler={handleSlotCreation}
          />
        </Collapse>
      </Box>
      {patterns.length > 0 ? (
        <Grid container rowSpacing={5} my={3} px={2}>
          {patterns.map((pattern, idx) => (
            <Grid item xs={12} key={idx}>
              <SchedulePatternCard pattern={pattern} />
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
          Нет шаблонов
        </Typography>
      )}
    </Box>
  );
}

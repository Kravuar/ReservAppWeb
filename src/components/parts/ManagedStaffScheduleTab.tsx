import {
  Schedule,
  ScheduleFormData,
  SchedulePatternFormData,
} from "../../domain/Schedule";
import { Box, Grid, Button, Collapse, Typography } from "@mui/material";
import ScheduleCard from "./ScheduleCard";
import { useState } from "react";
import ScheduleDetailsForm, {
  ScheduleDetailsFormData,
} from "./ScheduleDetailsForm";
import SchedulePatternsTab from "./SchedulePatternsTab";

export default function ManagedStaffScheduleTab({
  schedules,
  scheduleCreationHandler,
}: {
  schedules: Schedule[];
  scheduleCreationHandler: (formData: ScheduleFormData) => Promise<Schedule>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<SchedulePatternFormData[]>([]);

  async function onCreate(formData: ScheduleDetailsFormData): Promise<void> {
    return scheduleCreationHandler({
      ...formData,
      patterns: patterns,
    })
      .then()
      .catch((error) => error);
  }

  function handlePatternCreation(
    pattern: SchedulePatternFormData
  ): Promise<void> {
    setPatterns([...patterns, pattern]);
    return Promise.resolve();
  }

  return (
    <Box display="flex" flexDirection="column" sx={{ boxShadow: 10 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(!open)}
            sx={{ my: 2, mr: 1 }}
          >
            {open ? "Скрыть" : "Создать расписание"}
          </Button>
        </Box>

        <Collapse in={open}>
          <ScheduleDetailsForm onSubmit={onCreate} />
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
            Шаблоны
          </Typography>
          <SchedulePatternsTab
            patterns={patterns}
            schedulePatternCreationHandler={handlePatternCreation}
          />
        </Collapse>
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          py: 1,
          borderRadius: 1,
        }}
      >
        Расписания
      </Typography>
      <Grid container rowSpacing={5} my={3} px={2}>
        {schedules.map((schedule, idx) => (
          <Grid item xs={12} key={idx}>
            <ScheduleCard schedule={schedule} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

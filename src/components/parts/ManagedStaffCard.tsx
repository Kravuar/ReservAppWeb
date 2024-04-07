import { useEffect, useState } from "react";
import StaffCard from "./StaffCard";
import { Box, IconButton, Typography } from "@mui/material";
import { Staff } from "../../domain/Staff";
import { Cancel } from "@mui/icons-material";

export default function ManagedStaffCard({
  staff,
  removeHandler,
}: {
  staff: Staff;
  removeHandler: () => Promise<void>;
}) {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => setEnabled(staff.active), [staff]);

  function handleAction() {
    if (enabled)
      removeHandler()
        .then(() => setEnabled(false))
        .catch(() => {});
  }

  return (
    <Box>
      <Box display="flex" flexDirection="row" px={2}>
        <IconButton
          color="primary"
          aria-label="manage staff"
          component="span"
          sx={{
            border: 2,
            borderBottom: 0,
            borderRadius: 0,
          }}
          onClick={handleAction}
          disabled={!enabled}
        >
          <Cancel sx={{ mr: 1 }} fontSize="small"/>
          <Typography variant="subtitle1">Отстранить</Typography>
        </IconButton>
      </Box>
      <StaffCard staff={staff} />
    </Box>
  );
}

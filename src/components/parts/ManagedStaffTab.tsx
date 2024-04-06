import { useState } from "react";
import { Box, Button, Collapse } from "@mui/material";
import { Staff } from "../../domain/Staff";
import { Page } from "../../domain/Page";
import StaffForm from "./StaffForm";
import StaffList from "./StaffList";
import StaffCard from "./StaffCard";

export default function ManagedStaffTab({
  pageSupplier,
  staffInvitationHandler,
}: {
  pageSupplier: (page: number) => Promise<Page<Staff>>;
  staffInvitationHandler: (subject: string) => Promise<void>;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCreateOpen(!createOpen)}
      >
        {createOpen ? "Скрыть" : "Добавить сотрудника"}
      </Button>
      <Collapse in={createOpen} sx={{ my: 3 }}>
        <StaffForm onSubmit={staffInvitationHandler} />
      </Collapse>
      <StaffList pageSupplier={pageSupplier} CardComponent={(staff) => <StaffCard staff={staff}/>}/>
    </Box>
  );
}

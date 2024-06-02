import { useState } from "react";
import { Box, Button, Collapse, Typography, Paper } from "@mui/material";
import { Staff, StaffInvitation } from "../../domain/Staff";
import { Page } from "../../domain/Page";
import StaffForm from "./StaffForm";
import ManagedStaffCard from "./ManagedStaffCard";
import CardList from "./CardList";
import SimpleInvitationCard from "./SimpleInvitationCard";

export default function ManagedStaffTab({
  staffPageSupplier,
  invitationPageSupplier,
  staffInvitationHandler,
  removeHandler,
  declineHandler
}: {
  staffPageSupplier: (page: number) => Promise<Page<Staff>>;
  invitationPageSupplier: (page: number) => Promise<Page<StaffInvitation>>;
  staffInvitationHandler: (subject: string) => Promise<void>;
  removeHandler: (staff: Staff) => Promise<void>;
  declineHandler: (invitation: StaffInvitation) => Promise<void>;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
      <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Список сотрудников
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateOpen(!createOpen)}
            sx={{ mb: 2 }}
          >
            {createOpen ? "Спрятать" : "Добавить сотрудника"}
          </Button>
          <Collapse in={createOpen} sx={{ width: "100%", mb: 3 }}>
            <StaffForm onSubmit={staffInvitationHandler} />
          </Collapse>
          <CardList
            pageSupplier={staffPageSupplier}
            CardComponent={(props) => (
              <ManagedStaffCard
                staff={props.item}
                removeHandler={() => removeHandler(props.item)}
              />
            )}
          />
        </Box>
      </Paper>
      <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Приглашения
          </Typography>
          <CardList
            pageSupplier={invitationPageSupplier}
            CardComponent={(props) => (
              <SimpleInvitationCard
                invitation={props.item}
                declineHandler={() => declineHandler(props.item)}
              />
            )}
          />
        </Box>
      </Paper>
    </Box>
  );
}
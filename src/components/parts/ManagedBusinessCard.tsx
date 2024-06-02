import { useState } from "react";
import { Box, Button, Collapse, Tab, Tabs } from "@mui/material";
import BusinessCard from "./BusinessCard";
import { Business } from "../../domain/Business";
import { Page } from "../../domain/Page";
import { Service } from "../../domain/Service";
import { Staff, StaffInvitation } from "../../domain/Staff";
import ManagedServicesTab from "./ManagedServiceTab";
import ManagedStaffTab from "./ManagedStaffTab";
import { ServiceFormData } from "./ServiceForm";

export default function ManagedBusinessCard({
  business,
  servicePageSupplier,
  staffPageSupplier,
  invitationPageSupplier,
  serviceCreationHandler,
  staffInvitationHandler,
  staffRemovalHandler,
  invitationDeclineHandler
}: {
  business: Business;
  servicePageSupplier: (
    name: string,
    page: number
  ) => Promise<Page<Service>>;
  staffPageSupplier: (page: number) => Promise<Page<Staff>>;
  invitationPageSupplier: (page: number) => Promise<Page<StaffInvitation>>;
  serviceCreationHandler: (formData: ServiceFormData) => Promise<void>;
  staffInvitationHandler: (subject: string) => Promise<void>;
  staffRemovalHandler: (staff: Staff) => Promise<void>;
  invitationDeclineHandler: (invitation: StaffInvitation) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{ p: 2, borderRadius: 5, boxShadow: 5, bgcolor: "background.paper" }}
    >
      <BusinessCard business={business} />
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(!open)}
          sx={{ my: 1, px: 3, borderRadius: "4px", display: "flex", width: 1 }}
        >
          {open ? "Скрыть" : "Управление"}
        </Button>
      </Box>
      <Collapse in={open}>
        <Box sx={{ mt: 2 }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab label="Управление Услугами" />
            <Tab label="Управление Персоналом" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2 }}>
          {tab === 0 && (
            <ManagedServicesTab
              pageSupplier={servicePageSupplier}
              serviceCreationHandler={serviceCreationHandler}
            />
          )}
          {tab === 1 && (
            <ManagedStaffTab
              staffPageSupplier={staffPageSupplier}
              invitationPageSupplier={invitationPageSupplier}
              staffInvitationHandler={staffInvitationHandler}
              removeHandler={staffRemovalHandler}
              declineHandler={invitationDeclineHandler}
            />
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

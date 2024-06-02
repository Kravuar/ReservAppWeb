import { Page } from "../../domain/Page";
import { Business, BusinessFormData } from "../../domain/Business";
import { useState } from "react";
import { Box, Button, Collapse } from "@mui/material";
import BusinessForm from "./BusinessForm";
import ManagedBusinessCard from "./ManagedBusinessCard";
import { Service, ServiceFormData } from "../../domain/Service";
import { Staff, StaffInvitation } from "../../domain/Staff";
import CardList from "./CardList";

export default function ProfileBusinessesTab({
  pageSupplier,
  businessCreationHandler,
  servicePageSupplier,
  staffPageSupplier,
  invitationPageSupplier,
  serviceCreationHandler,
  staffInvitationHandler,
  staffRemovalHandler,
  invitationDeclineHandler
}: {
  pageSupplier: (page: number) => Promise<Page<Business>>;
  businessCreationHandler: (
    business: BusinessFormData
  ) => Promise<void>;
  servicePageSupplier: (
    business: Business,
    name: string,
    page: number
  ) => Promise<Page<Service>>;
  staffPageSupplier: (business: Business, page: number) => Promise<Page<Staff>>;
  invitationPageSupplier: (business: Business, page: number) => Promise<Page<StaffInvitation>>;
  serviceCreationHandler: (formData: ServiceFormData) => Promise<void>;
  staffInvitationHandler: (
    subject: string,
    business: Business
  ) => Promise<void>;
  staffRemovalHandler: (staff: Staff) => Promise<void>;
  invitationDeclineHandler: (invitation: StaffInvitation) => Promise<void>;
}) {
  const [open, setOpen] = useState<boolean>(false);

  async function onCreate(formData: BusinessFormData): Promise<void> {
    return businessCreationHandler(formData)
      .then()
      .catch((error) => error);
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ my: 2 }}>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "end" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(!open)}
            sx={{ my: 2 }}
          >
            {open ? "Скрыть" : "Создать бизнес"}
          </Button>
        </Box>

        <Collapse in={open}>
          <BusinessForm onSubmit={onCreate} />
        </Collapse>
      </Box>
      <CardList
        pageSupplier={pageSupplier}
        CardComponent={(props) => (
          <ManagedBusinessCard
            business={props.item}
            servicePageSupplier={(name, page) =>
              servicePageSupplier(props.item, name, page)
            }
            staffPageSupplier={(page) => staffPageSupplier(props.item, page)}
            invitationPageSupplier={(page) => invitationPageSupplier(props.item, page)}
            serviceCreationHandler={(formData) =>
              serviceCreationHandler({ businessId: props.item.id!, ...formData })
            }
            staffInvitationHandler={(subject) =>
              staffInvitationHandler(subject, props.item)
            }
            staffRemovalHandler={staffRemovalHandler}
            invitationDeclineHandler={invitationDeclineHandler}
          />
        )}
      />
    </Box>
  );
}

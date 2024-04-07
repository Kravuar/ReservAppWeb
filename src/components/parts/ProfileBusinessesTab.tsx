import BusinessList from "./BusinessList";
import { Page } from "../../domain/Page";
import { BusinessDetailed, BusinessFormData } from "../../domain/Business";
import { useState } from "react";
import { Box, Button, Collapse } from "@mui/material";
import BusinessForm from "./BusinessForm";
import ManagedBusinessCard from "./ManagedBusinessCard";
import { ServiceDetailed, ServiceFormData } from "../../domain/Service";
import { Staff } from "../../domain/Staff";

export default function ProfileBusinessesTab({
  pageSupplier,
  businessCreationHandler,
  servicePageSupplier,
  staffPageSupplier,
  serviceCreationHandler,
  staffInvitationHandler,
  staffRemovalHandler,
}: {
  pageSupplier: (page: number) => Promise<Page<BusinessDetailed>>;
  businessCreationHandler: (
    business: BusinessFormData
  ) => Promise<BusinessDetailed>;
  servicePageSupplier: (
    businessId: number,
    name: string,
    page: number
  ) => Promise<Page<ServiceDetailed>>;
  staffPageSupplier: (businessId: number, page: number) => Promise<Page<Staff>>;
  serviceCreationHandler: (formData: ServiceFormData) => Promise<void>;
  staffInvitationHandler: (
    subject: string,
    businessId: number
  ) => Promise<void>;
  staffRemovalHandler: (staffId: number) => Promise<void>;
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(!open)}
          sx={{ my: 2 }}
        >
          {open ? "Скрыть" : "Создать бизнес"}
        </Button>
        <Collapse in={open}>
          <BusinessForm onSubmit={onCreate} />
        </Collapse>
      </Box>
      <BusinessList
        pageSupplier={pageSupplier}
        CardComponent={(business) => (
          <ManagedBusinessCard
            business={business}
            servicePageSupplier={(name, page) => servicePageSupplier(business.id, name, page)}
            staffPageSupplier={(page) => staffPageSupplier(business.id, page)}
            serviceCreationHandler={(formData) => serviceCreationHandler({businessId: business.id, ...formData})}
            staffInvitationHandler={(subject) => staffInvitationHandler(subject, business.id)}
            staffRemovalHandler={staffRemovalHandler}
          />
        )}
      />
    </Box>
  );
}

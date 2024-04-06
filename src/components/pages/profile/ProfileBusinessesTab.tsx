import BusinessList from "../../parts/BusinessList";
import { Page } from "../../../domain/Page";
import { BusinessDetailed, BusinessFormData } from "../../../domain/Business";
import BusinessCard from "../../parts/BusinessCard";
import { useState } from "react";
import { Box, Button, Collapse } from "@mui/material";
import BusinessForm from "../../parts/BusinessForm";

export default function ProfileBusinessesTab({
  pageSupplier,
  businessCreationHandler,
}: {
  pageSupplier: (page: number) => Promise<Page<BusinessDetailed>>;
  businessCreationHandler: (
    business: BusinessFormData
  ) => Promise<BusinessDetailed>;
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
      <BusinessList pageSupplier={pageSupplier} CardComponent={BusinessCard} />
    </Box>
  );
}

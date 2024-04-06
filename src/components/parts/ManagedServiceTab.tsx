import { useState } from "react";
import { Box, Button, Collapse } from "@mui/material";
import ServiceList from "./ServiceList";
import { ServiceDetailed } from "../../domain/Service";
import { Page } from "../../domain/Page";
import ServiceForm, { ServiceFormData } from "./ServiceForm";
import ServiceCard from "./ServiceCard";

export default function ManagedServicesTab({
  pageSupplier,
  serviceCreationHandler
}: {
  pageSupplier: (name: string, page: number) => Promise<Page<ServiceDetailed>>;
  serviceCreationHandler: (formData: ServiceFormData) => Promise<void>;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCreateOpen(!createOpen)}
      >
        {createOpen ? "Скрыть" : "Добавить услугу"}
      </Button>
      <Collapse in={createOpen} sx={{my: 3}}>
        <ServiceForm onSubmit={serviceCreationHandler} />
      </Collapse>
      <ServiceList searchPageSupplier={pageSupplier} CardComponent={(service) => <ServiceCard service={service}/>}/>
    </Box>
  );
}

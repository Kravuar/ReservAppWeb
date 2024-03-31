import { BusinessDetailed } from "../../domain/Business";
import { Page } from "../../domain/Page";
import { ServiceDetailed } from "../../domain/Service";
import BusinessCard from "./BusinessCard";
import { Box, Card, CardContent, Typography } from "@mui/material";
import ServiceList from "./ServiceList";

export default function BusinessBody({
  business,
  serviceSupplier,
  searchServicesPageSupplier,
}: {
  business: BusinessDetailed;
  serviceSupplier: (page: number) => Promise<Page<ServiceDetailed>>;
  searchServicesPageSupplier: (
    name: string,
    page: number
  ) => Promise<Page<ServiceDetailed>>;
}) {
  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between">
      <BusinessCard business={business} />
      <Card sx={{ my: 2 }}>
        <CardContent>
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
            Услуги бизнеса
          </Typography>
          <ServiceList
            pageSupplier={serviceSupplier}
            searchPageSupplier={searchServicesPageSupplier}
            showBusiness={false}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

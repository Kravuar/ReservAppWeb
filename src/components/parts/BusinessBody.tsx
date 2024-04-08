import { BusinessDetailed } from "../../domain/Business";
import { Page } from "../../domain/Page";
import { ServiceDetailed } from "../../domain/Service";
import BusinessCard from "./BusinessCard";
import { Box, Card, CardContent, Typography } from "@mui/material";
import ServiceList from "./ServiceList";
import ServiceCard from "./ServiceCard";

export default function BusinessBody({
  business,
  searchServicesPageSupplier,
}: {
  business: BusinessDetailed;
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
            searchPageSupplier={searchServicesPageSupplier}
            CardComponent={(props) => <ServiceCard service={props.item}/>}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ServiceDetailed } from "../../domain/Service";

export default function SimpleServiceCard({
  service,
}: {
  service: ServiceDetailed;
}) {
  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      {/* Service Picture on the left part */}
      <CardMedia
        component="img"
        sx={{ width: "30%", padding: 2 }}
        image={service.picture}
        alt={service.name}
      />
      {/* Service Details on the right part */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "70%" }}>
        <CardContent sx={{ flex: "1 0 auto", position: "relative" }}>
          {/* Service Name */}
          <Typography component="div" variant="h3">
            <Button component={Link} to={`/home/services/${service.id}`}>
              {service.name}
            </Button>
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

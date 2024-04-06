import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ServiceDetailed } from "../../domain/Service";

export default function ServiceCard({ service }: { service: ServiceDetailed }) {

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
          {/* Service Name and Rating */}
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography component="div" variant="h3">
              <Button component={Link} to={`/home/services/${service.id}`}>
                {service.name}
              </Button>
            </Typography>
            <Rating value={service.rating} readOnly />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            {/* Service Description */}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              marginTop={1}
            >
              {service.description}
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

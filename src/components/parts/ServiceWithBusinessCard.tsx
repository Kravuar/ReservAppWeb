import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Skeleton,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Service } from "../../domain/Service";

export default function ServiceWithBusinessCard({ service }: { service: Service }) {
  return (
    <Card sx={{ display: "flex", boxShadow: 3 }}>
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
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Service Name and Rating */}
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography component="div" variant="h3">
                <Button component={Link} to={`/home/services/${service.id}`}>
                  {service.name}
                </Button>
              </Typography>
              <Rating value={service.rating} readOnly />
            </Box>
            {/* Business Info */}
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Button
                component={Link}
                to={`/home/businesses/${service.business!.id!}`}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Avatar src={service.business!.picture!}>
                    <Skeleton variant="circular" width={40} height={40} />
                  </Avatar>
                  <Typography marginLeft={1} variant="overline">
                    {service.business!.name!}
                  </Typography>
                </Box>
              </Button>
              <Rating value={service.business!.rating!} readOnly size="small" />
            </Box>
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

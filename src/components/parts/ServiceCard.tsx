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
import { useState } from "react";

export interface Business {
  id: number;
  name: string;
  picture: string;
  rating: number;
}

export interface ServiceData {
  id: number;
  name: string;
  description: string;
  picture: string;
  rating: number;
  business: Business;
}

export default function ServiceCard({ service }: { service: ServiceData }) {
  const [serviceImageLoaded, setServiceImageLoaded] = useState(false);
  const [businessImageLoaded, setBusinessImageLoaded] = useState(false);

  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      {/* Service Picture on the left part */}
      {!serviceImageLoaded && <Skeleton variant="text" width="40%" />}
      <CardMedia
        component="img"
        sx={{ width: "30%", padding: 2 }}
        image={service.picture}
        alt={service.name}
        onLoad={() => setServiceImageLoaded(true)}
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
                <Button component={Link} to={`/services?id=${service.id}`}>
                  {service.name}
                </Button>
              </Typography>
              <Rating name="read-only" value={service.rating} readOnly />
            </Box>
            {/* Business Info */}
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Button
                component={Link}
                to={`/business?id=${service.business.id}`}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  {!businessImageLoaded && (
                    <Skeleton variant="circular" width={40} height={40} />
                  )}
                  <Avatar
                    src={service.business.picture}
                    slotProps={{
                      img: {
                        onLoad: () => setBusinessImageLoaded(true),
                      },
                    }}
                  />
                  <Typography marginLeft={1} variant="overline">
                    {service.business.name}
                  </Typography>
                </Box>
              </Button>
              <Rating
                name="read-only"
                value={service.business.rating}
                readOnly
                size="small"
              />
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

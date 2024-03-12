import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";

export interface BusinessData {
  id: number;
  name: string;
  picture: string;
  description: string;
  rating: number;
}

export default function BusinessCard({ business }: { business: BusinessData }) {
  const [businessImageLoaded, setBusinessImageLoaded] = useState(false);

  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      {/* Business Picture on the left part */}
      {!businessImageLoaded && <Skeleton variant="text" width="30%" />}
      <CardMedia
        component="img"
        sx={{ width: "30%" }}
        image={business.picture}
        alt={business.name}
        onLoad={() => setBusinessImageLoaded(true)}
      />
      {/* Business Details on the right part */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "70%"}}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            <Button component={Link} to={`/business?id=${business.id}`}>
              {business.name}
            </Button>
          </Typography>
          <Rating name="read-only" value={business.rating} readOnly />
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            marginTop={1}
          >
            {business.description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

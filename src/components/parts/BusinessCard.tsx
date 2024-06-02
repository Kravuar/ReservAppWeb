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
import { Business } from "../../domain/Business";

export default function BusinessCard({ business }: { business: Business }) {

  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      {/* Business Picture on the left part */}
      <CardMedia
        component="img"
        sx={{ width: "30%" }}
        image={business.picture!}
        alt={business.name!}
      />
      {/* Business Details on the right part */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "70%"}}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            <Button component={Link} to={`/home/businesses/${business.id}`}>
              {business.name!}
            </Button>
          </Typography>
          <Rating value={business.rating!} readOnly />
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            marginTop={1}
          >
            {business.description!}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

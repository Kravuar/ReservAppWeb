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
import { Staff } from "../../domain/Staff";

export default function StaffCard({ staff }: { staff: Staff }) {

  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      {/* Staff Picture on the left part */}
      <CardMedia
        component="img"
        sx={{ width: "10%", padding: 2, borderRadius: 10 }}
        image={staff.picture}
        alt={staff.name}
      />
      {/* Staff Details on the right part */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
        <CardContent sx={{ flex: "1 0 auto", position: "relative" }}>
          {/* Staff Name and Rating */}
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography component="div" variant="h3">
              <Button component={Link} to={`/home/staff/${staff.id}`}>
                {staff.name}
              </Button>
            </Typography>
            <Rating value={staff.rating} readOnly />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            {/* Staff Description */}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              marginTop={1}
            >
              {staff.description}
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

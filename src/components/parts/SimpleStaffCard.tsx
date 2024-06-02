import { Avatar, IconButton, Skeleton, Typography } from "@mui/material";
import { Staff } from "../../domain/Staff";
import { Link } from "react-router-dom";

export default function SimpleStaffCard({ staff }: { staff: Staff }) {
  return (
    <IconButton component={Link} to={`/profile/business/staff/${staff.id!}`}>
      <Avatar src={staff.picture!}>
        <Skeleton variant="circular" width={40} height={40} />
      </Avatar>
      <Typography
        variant="caption"
        gutterBottom
        sx={{
          textAlign: "center",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          py: 1,
          borderRadius: 1,
        }}
      >
        {staff.name!}
      </Typography>
    </IconButton>
  );
}

import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { UserInfo } from "../../domain/Profile";

export default function ProfileCard({ name, picture }: UserInfo) {
  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      {/* Profile Picture on the left part */}
      {picture && (
        <CardMedia
          component="img"
          sx={{ width: "30%" }}
          image={picture}
          alt={name}
        />
      )}
      {/* Profile Details on the right part */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "70%" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h3">
            {name ? name : "Имя пользователя скрыто"}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

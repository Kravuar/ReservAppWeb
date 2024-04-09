import { useEffect, useState } from "react";
import { Box, Card, CardContent, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { useAlert } from "../../util/Alert";
import { Staff } from "../../../domain/Staff";
import StaffCard from "../../parts/StaffCard";
import { staffById } from "../../../services/api";

export default function StaffPage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withAlert, withErrorAlert } = useAlert();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Номер услуги обязателен");
      return;
    }
    staffById(id)
      .then(setStaff)
      .catch((error) => setError(error));
  }, [id]);

  if (staff)
    return (
      <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <StaffCard staff={staff}/>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        Расписания
      </Box>
    </Box>
    );
  else if (error) return <ErrorPage message={error} />;
  else return <SkeletonBody />;
}

function SkeletonBody() {
  return (
    <Card sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}>
      <Skeleton
        variant="rectangular"
        sx={{ width: "10%", padding: 2, borderRadius: 10 }}
      />
      <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
        <CardContent sx={{ flex: "1 0 auto", position: "relative" }}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" width={100} height={30} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}
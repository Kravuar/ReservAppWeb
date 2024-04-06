import { useEffect, useState } from "react";
import BusinessBody from "../../parts/BusinessBody";
import { BusinessDetailed } from "../../../domain/Business";
import { Box, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { detailedBusinessById, servicesByBusiness } from "../../../services/api";
import { Page } from "../../../domain/Page";
import { ServiceDetailed } from "../../../domain/Service";
import { useAlert } from "../../util/Alert";

export default function BusinessPage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withErrorAlert } = useAlert();
  const [business, setBusiness] = useState<BusinessDetailed | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Номер бизнеса обязателен");
      return;
    }
    detailedBusinessById(id)
      .then(setBusiness)
      .catch((error) => setError(error));
  }, [id]);

  async function fetchData(page: number): Promise<Page<ServiceDetailed>> {
      return withErrorAlert(() => servicesByBusiness(id, page, 10));
  }

  async function fetchDataWithName(
    name: string,
    page: number
  ): Promise<Page<ServiceDetailed>> {
    // TODO: adjust, when server implements search
    return await fetchData(page);
  }

  if (business)
    return (
      <BusinessBody
        business={business}
        searchServicesPageSupplier={(name, page) =>
          fetchDataWithName(name, page)
        }
      />
    );
  else if (error) return <ErrorPage message={error} />;
  else return <SkeletonBody />;
}

function SkeletonBody() {
  return (
    <Box>
      {Array.from(Array(10)).map((_, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box ml={2} flex={1}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          <Skeleton variant="text" width={80} />
        </Box>
      ))}
    </Box>
  );
}

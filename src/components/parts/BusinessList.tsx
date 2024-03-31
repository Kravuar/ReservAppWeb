import { Box, Pagination, Skeleton } from "@mui/material";
import BusinessCard from "./BusinessCard";
import { Page } from "../../domain/Page";
import { BusinessDetailed } from "../../domain/Business";
import { useEffect, useState } from "react";
import ErrorPage from "../util/ErrorPage";

export default function BusinessList({
  pageSupplier,
}: {
  pageSupplier: (page: number) => Promise<Page<BusinessDetailed>>;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<BusinessDetailed>>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pageSupplier(pageNumber)
      .then((page) => setPage(page))
      .catch((error) => setError(error));
  }, [pageNumber, pageSupplier]);

  if (page)
    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={page?.totalPages || 1}
            page={pageNumber}
            onChange={(_, newPage) => setPageNumber(newPage)}
            sx={{ marginTop: 1 }}
            showFirstButton
            showLastButton
          />
        </Box>
        <Box sx={{ overflow: "auto" }}>
          {page?.content?.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </Box>
        {page?.content?.length !== undefined && page?.content?.length > 3 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={page?.totalPages || 1}
              page={pageNumber}
              onChange={(_, newPage) => setPageNumber(newPage)}
              sx={{ marginTop: 1 }}
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
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

import { Box, Pagination } from "@mui/material";
import BusinessCard from "./BusinessCard";
import { Page } from "../../domain/Page";
import { BusinessDetailed } from "../../domain/Business";
import { useEffect, useState } from "react";


export default function BusinessList(
  {pageSupplier}: {pageSupplier: (page: number) => Promise<Page<BusinessDetailed>>}
) {
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<BusinessDetailed>>();

  useEffect(() => {
    pageSupplier(pageNumber)
    .then(page => setPage(page))
    .catch(error => alert(error));
  }, [pageNumber, pageSupplier]);

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
}

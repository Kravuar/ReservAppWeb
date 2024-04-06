import { Box, Grid, Pagination } from "@mui/material";
import { Page } from "../../domain/Page";
import { BusinessDetailed } from "../../domain/Business";
import { useEffect, useState } from "react";

export default function BusinessList({
  pageSupplier,
  CardComponent,
}: {
  pageSupplier: (page: number) => Promise<Page<BusinessDetailed>>;
  CardComponent: React.ComponentType<BusinessDetailed>;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<BusinessDetailed>>();

  useEffect(() => {
    pageSupplier(pageNumber)
      .then((page) => setPage(page))
      .catch();
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
      <Grid container rowSpacing={5} my={3}>
        {page?.content?.map((business) => (
          <Grid item xs={12} key={business.id}>
            <CardComponent {...business} />
          </Grid>
        ))}
      </Grid>
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

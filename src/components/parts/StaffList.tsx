import { Box, Grid, Pagination } from "@mui/material";
import { Page } from "../../domain/Page";
import { Staff } from "../../domain/Staff";
import { useEffect, useState } from "react";

export default function StaffList({
  pageSupplier,
  CardComponent,
}: {
  pageSupplier: (page: number) => Promise<Page<Staff>>;
  CardComponent: React.ComponentType<Staff>;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<Staff>>();

  useEffect(() => {
    pageSupplier(pageNumber)
      .then((page) => setPage(page))
      .catch(() => {});
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
        {page?.content?.map((staff) => (
          <Grid item xs={12} key={staff.id}>
            <CardComponent {...staff} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

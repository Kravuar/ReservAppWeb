import { Box, Grid, Pagination } from "@mui/material";
import { Page } from "../../domain/Page";
import { useEffect, useState } from "react";

export default function CardList<T>({
  pageSupplier,
  CardComponent,
}: {
  pageSupplier: (page: number) => Promise<Page<T>>;
  CardComponent: React.ComponentType<{item: T}>;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<T>>();

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
        {page?.content?.map((item, idx) => (
          <Grid item xs={12} key={idx}>
            <CardComponent item={item}/>
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

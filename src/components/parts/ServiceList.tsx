import { Box, Button, Grid, Pagination, TextField } from "@mui/material";
import { Page } from "../../domain/Page";
import { ServiceDetailed } from "../../domain/Service";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function ServiceList({
  searchPageSupplier,
  CardComponent,
}: {
  searchPageSupplier: (
    name: string,
    page: number
  ) => Promise<Page<ServiceDetailed>>;
  CardComponent: React.ComponentType<ServiceDetailed>;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [name, setName] = useState("");
  const [page, setPage] = useState<Page<ServiceDetailed>>();

  useEffect(() => {
    searchPageSupplier(name, pageNumber).then(setPage).catch();
  }, [name, pageNumber, searchPageSupplier]);

  function handleSearchClick() {
    searchPageSupplier(name, pageNumber).then(setPage).catch();
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingX: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={handleSearchClick}
            endIcon={<SearchIcon sx={{ marginRight: 1 }} />}
          >
            Найти
          </Button>
          <TextField
            id="search-bar"
            label="Название"
            variant="outlined"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Box>
        <Pagination
          count={page?.totalPages || 1}
          page={pageNumber}
          onChange={(_, newPage) => setPageNumber(newPage)}
          sx={{ marginTop: 2 }}
          showFirstButton
          showLastButton
        />
      </Box>
      <Grid container rowSpacing={5} my={3}>
        {page?.content?.map((service) => (
          <Grid item xs={12} key={service.id}>
            <CardComponent {...service} />
          </Grid>
        ))}
      </Grid>
      {page?.content.length !== undefined && page?.content.length > 3 && (
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

import { Box, Button, Pagination, TextField } from "@mui/material";
import ServiceCard from "./ServiceCard";
import { Page } from "../../domain/Page";
import { ServiceDetailed } from "../../domain/Service";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function ServiceList({
  searchPageSupplier,
  showBusiness,
}: {
  searchPageSupplier: (
    name: string,
    page: number
  ) => Promise<Page<ServiceDetailed>>;
  showBusiness: boolean;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [name, setName] = useState("");
  const [page, setPage] = useState<Page<ServiceDetailed>>();

  useEffect(() => {
    searchPageSupplier(name, pageNumber)
    .then(setPage)
    .catch(() => setPage({content: [], totalPages: 0}));
  }, [name, pageNumber, searchPageSupplier]);

  function handleSearchClick() {
    searchPageSupplier(name, pageNumber)
    .then(setPage)
    .catch(() => setPage({content: [], totalPages: 0}));
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
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
      <Box sx={{ overflow: "auto" }}>
        {page?.content.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            showBusiness={showBusiness}
          />
        ))}
      </Box>
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

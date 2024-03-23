import { Box, Button, Pagination, TextField } from "@mui/material";
import ServiceCard from "./ServiceCard";
import { Page } from "../../domain/Page";
import { ServiceDetailed } from "../../domain/Service";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

function search(
  name: string,
  pageNumber: number,
  setPage: (page: Page<ServiceDetailed>) => void,
  pageSupplier: (page: number) => Promise<Page<ServiceDetailed>>,
  searchPageSupplier: (name: string, page: number) => Promise<Page<ServiceDetailed>>
) {
  var page: Promise<Page<ServiceDetailed>>;
  if (name) page = searchPageSupplier(name, pageNumber);
  else page = pageSupplier(pageNumber);

  page.then(setPage).catch((error) => alert(error));
}

export default function ServiceList({
  pageSupplier,
  searchPageSupplier,
}: {
  pageSupplier: (page: number) => Promise<Page<ServiceDetailed>>;
  searchPageSupplier: (name: string, page: number) => Promise<Page<ServiceDetailed>>;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [name, setName] = useState("");
  const [page, setPage] = useState<Page<ServiceDetailed>>();

  useEffect(() => {
    search(name, pageNumber, setPage, pageSupplier, searchPageSupplier);
  }, [name, pageNumber, pageSupplier, searchPageSupplier]);

  function handlePageChange(_: React.ChangeEvent<unknown>, value: number) {
    setPageNumber(value);
  }

  function handleSearchClick() {
    search(name, pageNumber, setPage, pageSupplier, searchPageSupplier);
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
          onChange={handlePageChange}
          sx={{ marginTop: 2 }}
          showFirstButton
          showLastButton
        />
      </Box>
      <Box sx={{ overflow: "auto" }}>
        {page?.content.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </Box>
      {page?.content.length !== undefined && page?.content.length > 3 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={page?.totalPages || 1}
            page={pageNumber}
            onChange={handlePageChange}
            sx={{ marginTop: 1 }}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}

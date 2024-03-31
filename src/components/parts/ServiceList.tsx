import { Box, Button, Pagination, Skeleton, TextField } from "@mui/material";
import ServiceCard from "./ServiceCard";
import { Page } from "../../domain/Page";
import { ServiceDetailed } from "../../domain/Service";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ErrorPage from "../util/ErrorPage";

function search(
  name: string,
  pageNumber: number,
  setPage: (page: Page<ServiceDetailed>) => void,
  pageSupplier: (page: number) => Promise<Page<ServiceDetailed>>,
  searchPageSupplier: (
    name: string,
    page: number
  ) => Promise<Page<ServiceDetailed>>,
  setError: (error: any) => void
) {
  var page: Promise<Page<ServiceDetailed>>;
  if (name) page = searchPageSupplier(name, pageNumber);
  else page = pageSupplier(pageNumber);

  page.then(setPage);
}

export default function ServiceList({
  pageSupplier,
  searchPageSupplier,
  showBusiness,
}: {
  pageSupplier: (page: number) => Promise<Page<ServiceDetailed>>;
  searchPageSupplier: (
    name: string,
    page: number
  ) => Promise<Page<ServiceDetailed>>;
  showBusiness: boolean;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [name, setName] = useState("");
  const [page, setPage] = useState<Page<ServiceDetailed>>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    search(
      name,
      pageNumber,
      setPage,
      pageSupplier,
      searchPageSupplier,
      setError
    );
  }, [name, pageNumber, pageSupplier, searchPageSupplier]);

  function handleSearchClick() {
    search(
      name,
      pageNumber,
      setPage,
      pageSupplier,
      searchPageSupplier,
      setError
    );
  }

  if (page)
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
  else if (error) return <ErrorPage message={error} />;
  else return <SkeletonBody/>
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

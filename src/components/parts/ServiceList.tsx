import { Box, Button, TextField } from "@mui/material";
import { Page } from "../../domain/Page";
import { ServiceDetailed } from "../../domain/Service";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CardList from "./CardList";

export default function ServiceList({
  searchPageSupplier,
  CardComponent,
}: {
  searchPageSupplier: (
    name: string,
    page: number
  ) => Promise<Page<ServiceDetailed>>;
  CardComponent: React.ComponentType<{ item: ServiceDetailed }>;
}) {
  const [name, setName] = useState("");
  const [pageSupplier, setPageSupplier] = useState<
    (page: number) => Promise<Page<ServiceDetailed>>
  >(() => (page: number) => searchPageSupplier("", page));

  function handleSearchClick() {
    setPageSupplier((page: number) => searchPageSupplier(name, page));
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
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
      <CardList pageSupplier={pageSupplier} CardComponent={CardComponent} />
    </Box>
  );
}

import { Box, Pagination, Tab, Tabs } from "@mui/material";
import { Page } from "../../domain/Page";
import { useEffect, useState } from "react";

export default function CardList<T>({
  pageSupplier,
  CardComponent,
  horizontal,
  selectHandler,
}: {
  pageSupplier: (page: number) => Promise<Page<T>>;
  CardComponent: React.ComponentType<{ item: T }>;
  horizontal: boolean;
  selectHandler: (item: T) => void;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<T>>();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    pageSupplier(pageNumber)
      .then((page) => setPage(page))
      .catch(() => {});
  }, [pageNumber, pageSupplier]);

  function handleTabChange(
    _: React.SyntheticEvent<Element, Event>,
    newItemIndex: number
  ) {
    setTab(newItemIndex);
    selectHandler(page?.content[newItemIndex]!);
  }

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
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="staff tabs"
        orientation={horizontal ? "horizontal" : "vertical"}
      >
        {/* {page?.content.map((item) => (
          <Tab>
            <CardComponent item={item} />
          </Tab>
        ))} */}
      </Tabs>
    </Box>
  );
}

import { Box, Pagination } from "@mui/material";
import { Page } from "../../domain/Page";
import { BusinessDetailed } from "../../domain/Business";
import { useEffect, useState } from "react";

export default function BusinessList({
  pageSupplier,
  CardComponent,
  propsExtractor
}: {
  pageSupplier: (page: number) => Promise<Page<BusinessDetailed>>;
  CardComponent: React.ComponentType<{ business: BusinessDetailed }>;
  propsExtractor?: (business: BusinessDetailed) => any;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<BusinessDetailed>>();

  useEffect(() => {
    pageSupplier(pageNumber)
      .then((page) => setPage(page))
      .catch(() => setPage({ content: [], totalPages: 0 }));
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
        {page?.content?.map((business) => {
          const props = propsExtractor ? propsExtractor(business) : null;
          return (
            <CardComponent key={business.id} business={business} {...props} />
          );
        })}
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

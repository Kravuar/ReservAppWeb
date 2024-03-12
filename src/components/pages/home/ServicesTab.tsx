import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { Box, TextField, Pagination, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ServiceCard, { ServiceData } from "../../parts/ServiceCard";

interface ServiceListData {
  services: ServiceData[];
  totalPages: number;
}

function fakeData(): ServiceListData {
  const fakeServices: ServiceData[] = [];
  const itemsPerPage = 10;
  const totalServices = 100;

  for (let i = 0; i < itemsPerPage; i++) {
    const service: ServiceData = {
      id: faker.number.int(),
      name: faker.commerce.productName(),
      picture: faker.image.url(),
      description: faker.lorem.paragraphs(5),
      rating: faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
      business: {
        id: faker.number.int(),
        name: faker.person.fullName(),
        picture: faker.image.url(),
        rating: faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
      },
    };
    fakeServices.push(service);
  }

  return {
    services: fakeServices,
    totalPages: Math.ceil(totalServices / itemsPerPage),
  };
}

export default function ServiceTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ServiceListData | null>(null);
  const [page, setPage] = useState(1);

  function fetchData() {
    const fake = fakeData();
    setData(fake);

    // axios
    //   .get<ServiceListData>(
    //     `${process.env.REACT_APP_BACKEND}/services/api-v1/find/${searchTerm}/${page}`
    //   )
    //   .then((response) => setData(response.data))
    //   .catch((error) => alert(error.message));
  }

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

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
            onClick={fetchData}
            endIcon={<SearchIcon sx={{ marginRight: 1 }} />}
          >
            Найти
          </Button>
          <TextField
            id="search-bar"
            label="Название"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
        <Pagination
          count={data?.totalPages || 1}
          page={page}
          onChange={handlePageChange}
          sx={{ marginTop: 2 }}
          showFirstButton
          showLastButton
        />
      </Box>
      <Box sx={{ overflow: "auto" }}>
        {data?.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </Box>
      {data?.services.length !== undefined && data?.services.length > 3 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={data?.totalPages || 1}
            page={page}
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

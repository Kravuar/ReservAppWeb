import React, { useEffect, useState } from "react";
import { Box, Button, Pagination } from "@mui/material";
import { faker } from "@faker-js/faker";
import BusinessCard, { BusinessData } from "../../parts/BusinessCard";

import { useOktaAuth } from "@okta/okta-react";
import axios from "axios";

interface Business {
  id: number;
  name: string;
  ownerSub: string;
}

function Test() {
  const { authState } = useOktaAuth();
  const [authorizedEntities, setAuthorizedEntities] = useState<Business[]>([]);
  const [nonAuthorizedEntities, setNonAuthorizedEntities] = useState<
    Business[]
  >([]);

  useEffect(() => {
    const fetchAuthorizedEntities = async () => {
      try {
        if (authState?.isAuthenticated && authState.accessToken) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND}/business/api-v1/retrieval/my`,
            {
              headers: {
                Authorization: `Bearer ${authState.accessToken.accessToken}`,
              },
            }
          );
          setAuthorizedEntities(response.data);
        }
      } catch (error) {
        console.error("Error fetching authorized entities:", error);
      }
    };

    const fetchNonAuthorizedEntities = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/business/api-v1/retrieval/active`
        );
        setNonAuthorizedEntities(response.data);
      } catch (error) {
        console.error("Error fetching non-authorized entities:", error);
      }
    };

    if (authState?.isAuthenticated) {
      fetchAuthorizedEntities();
    }

    fetchNonAuthorizedEntities();
  }, [authState]);

  async function onPost() {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND}/business/api-v1/management/create`, 
      {
        name: "BEBEBE INC"
      },
      {
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        },
      }
    );
    console.log(response.data);
  }

  return (
    <div>
      <h2>Authorized Entities</h2>
      <Button onClick={onPost}>Post</Button>
      <ul>
        {authorizedEntities.map((entity) => (
          <li key={entity.id}>
            {`ID: ${entity.id}, Name: ${entity.name}, Owner Sub: ${entity.ownerSub}`}
          </li>
        ))}
      </ul>

      <h2>Non-Authorized Entities</h2>
      <ul>
        {nonAuthorizedEntities.map((entity) => (
          <li key={entity.id}>
            {`ID: ${entity.id}, Name: ${entity.name}, Owner Sub: ${entity.ownerSub}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface BusinessListData {
  businesses: BusinessData[];
  totalPages: number;
}

function fakeData(page: number): BusinessListData {
  const fakeBusinesses: BusinessData[] = [];
  const itemsPerPage = 10;
  const totalBusinesses = 100;

  for (let i = 0; i < itemsPerPage; i++) {
    const business: BusinessData = {
      id: faker.number.int(),
      name: faker.lorem.word(),
      picture: faker.image.url(),
      description: faker.lorem.paragraph(),
      rating: faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
    };
    fakeBusinesses.push(business);
  }

  return {
    businesses: fakeBusinesses,
    totalPages: Math.ceil(totalBusinesses / itemsPerPage),
  };
}

export default function BusinessTab() {
  const [data, setData] = useState<BusinessListData | null>(null);
  const [page, setPage] = useState(1);

  function fetchData() {
    const fake = fakeData(page);
    setData(fake);

    // You can replace this with actual API call if needed
    // axios
    //   .get<BusinessListData>(
    //     `${process.env.REACT_APP_BACKEND}/businesses/api-v1/${page}`
    //   )
    //   .then((response) => setData(response.data))
    //   .catch((error) => alert(error.message));
  }

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Box>
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
      <Test />
      <Box sx={{ overflow: "auto" }}>
        {data?.businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
        Test
      </Box>
      {data?.businesses.length !== undefined && data?.businesses.length > 3 && (
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

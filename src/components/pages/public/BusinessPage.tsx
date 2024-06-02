import BusinessBody from "../../parts/BusinessBody";
import { Business } from "../../../domain/Business";
import { Box, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorPage from "../../util/ErrorPage";
import { Page } from "../../../domain/Page";
import { Service } from "../../../domain/Service";
import { useAlert } from "../../util/Alert";
import gql from "graphql-tag";
import { useApolloClient, useQuery } from "@apollo/client";

const businessQuery = gql`
  query Business($businessId: ID!) {
    business(businessId: $businessId) {
      id
      name
      ownerSub
      active
      description
    }
  }
`;

const servicesQuery = gql`
  query ServicesOfBusiness($businessId: ID!, $page: Int!) {
    business(businessId: $businessId) {
      services(page: $page, pageSize: 10) {
        content {
          id
          name
          description
        }
        totalPages
      }
    }
  }
`;

export default function BusinessPage() {
  const id = Number(useParams<{ id: string }>().id);
  const { withErrorAlert } = useAlert();
  const client = useApolloClient();
  const {loading, error, data} = useQuery<{business: Business}>(businessQuery, {variables: {businessId: id}});
  const business = data?.business;

  if (business) {
    const fetchServicesOfBusiness = async (page: number): Promise<Page<Service>> => {
      return withErrorAlert(() => client.query<{business: {services: Page<Service>}}>({
            query: servicesQuery,
            variables: {
              businessId: id,
              page: page - 1 - 1
            },
          })
          .then((response) => response.data)
          .then(result => {
            result.business.services.content.forEach(service => service.business = business);
            return result.business.services;
          })
      );
    }

    const fetchServicesByName = async (name: string, page: number): Promise<Page<Service>> => {
      // TODO: adjust, when server implements search
      return await fetchServicesOfBusiness(page);
    }

    return (
      <BusinessBody
        business={business}
        searchServicesPageSupplier={(name, page) =>
          fetchServicesByName(name, page)
        }
      />
    );
  } else if (loading) return <SkeletonBody />; 
    else return <ErrorPage message={error!.message} />;
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

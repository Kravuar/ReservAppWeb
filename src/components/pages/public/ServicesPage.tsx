import ServiceList from "../../parts/ServiceList";
import { Page } from "../../../domain/Page";
import { Service } from "../../../domain/Service";
import { useAlert } from "../../util/Alert";
import ServiceWithBusinessCard from "../../parts/ServiceWithBusinessCard";
import gql from "graphql-tag";
import { useApolloClient } from "@apollo/client";

const servicesQuery = gql`
  {
    services(page: $page, pageSize: 10) {
      contents {
        id
        name
        business {
          name
          ownerSub
        }
        active
        description
      }
      totalPages
    }
  }
`;

export default function ServicesPage() {
  const { withErrorAlert } = useAlert();
  const client = useApolloClient();

  const fetchServices = async (page: number): Promise<Page<Service>> => {
    return withErrorAlert(() =>
      client
        .query<Page<Service>>({
          query: servicesQuery,
          variables: {
            page: page,
          },
        })
        .then((response) => response.data)
    );
  };

  const fetchDataWithName = async (_: string, page: number): Promise<Page<Service>> => {
    // TODO: adjust, when server implements search
    return await fetchServices(page);
  };

  return (
    <ServiceList
      searchPageSupplier={fetchDataWithName}
      CardComponent={(props) => (
        <ServiceWithBusinessCard service={props.item} />
      )}
    />
  );
}

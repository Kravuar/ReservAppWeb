import { Page } from "../../../domain/Page";
import { Business } from "../../../domain/Business";
import { useAlert } from "../../util/Alert";
import BusinessCard from "../../parts/BusinessCard";
import CardList from "../../parts/CardList";
import { gql, useApolloClient } from "@apollo/client";

const businessesQuery = gql`
  {
    businesses(page: $page, pageSize: 10) {
      contents {
        id
        name
        ownerSub
        active
        description
      }
      totalPages
    }
  }
`;

export default function BusinessesPage() {
  const { withErrorAlert } = useAlert();
  const client = useApolloClient();

  const fetchBusinesses = async (page: number): Promise<Page<Business>> => {
    return withErrorAlert(() =>
      client.query<Page<Business>>({
          query: businessesQuery,
          variables: {
            page: page,
          },
        }).then((response) => response.data)
    );
  }

  return (
    <CardList
      pageSupplier={fetchBusinesses}
      CardComponent={(props) => <BusinessCard business={props.item} />}
    />
  );
}

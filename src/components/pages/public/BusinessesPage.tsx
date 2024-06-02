import { Page } from "../../../domain/Page";
import { Business } from "../../../domain/Business";
import { useAlert } from "../../util/Alert";
import BusinessCard from "../../parts/BusinessCard";
import CardList from "../../parts/CardList";
import { gql, useApolloClient } from "@apollo/client";

const businessesQuery = gql`
  query Businesses($page: Int!) {
    businesses(page: $page, pageSize: 10) {
      content {
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
      client.query<{businesses: Page<Business>}>({
          query: businessesQuery,
          variables: {
            page: page - 1,
          },
        }).then((response) => response.data.businesses)
    );
  }

  return (
    <CardList
      pageSupplier={fetchBusinesses}
      CardComponent={(props) => <BusinessCard business={props.item} />}
    />
  );
}

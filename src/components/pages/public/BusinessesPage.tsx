import { Page } from "../../../domain/Page";
import { BusinessDetailed } from "../../../domain/Business";
import { activeDetailedBusinesses } from "../../../services/api";
import { useAlert } from "../../util/Alert";
import BusinessCard from "../../parts/BusinessCard";
import CardList from "../../parts/CardList";

export default function BusinessesPage() {
  const { withErrorAlert } = useAlert();

  function fetchData(page: number): Promise<Page<BusinessDetailed>> {
      return withErrorAlert(() => activeDetailedBusinesses(page, 10));
  }

  return <CardList pageSupplier={fetchData} CardComponent={(props) => <BusinessCard business={props.item}/>} />;
}

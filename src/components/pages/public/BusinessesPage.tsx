import BusinessList from "../../parts/BusinessList";
import { Page } from "../../../domain/Page";
import { BusinessDetailed } from "../../../domain/Business";
import { activeDetailedBusinesses } from "../../../services/api";
import { useAlert } from "../../util/Alert";
import BusinessCard from "../../parts/BusinessCard";

export default function BusinessesPage() {
  const { withErrorAlert } = useAlert();

  function fetchData(page: number): Promise<Page<BusinessDetailed>> {
      return withErrorAlert(() => activeDetailedBusinesses(page, 10));
  }

  return <BusinessList pageSupplier={fetchData} CardComponent={(business) => <BusinessCard business={business}/>} />;
}

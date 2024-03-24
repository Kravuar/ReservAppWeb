import BusinessList from "../../parts/BusinessList";
import { Page } from "../../../domain/Page";
import { BusinessDetailed } from "../../../domain/Business";
import { activeBusinesses } from "../../../services/api";

export default function BusinessesPage() {
  function fetchData(page: number): Promise<Page<BusinessDetailed>> {
    return activeBusinesses(page, 10);
  }

  return (
    <BusinessList pageSupplier={fetchData}/>
  );
}

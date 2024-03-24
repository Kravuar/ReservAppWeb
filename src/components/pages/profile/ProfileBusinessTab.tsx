import BusinessList from "../../parts/BusinessList";
import { Page } from "../../../domain/Page";
import { BusinessDetailed } from "../../../domain/Business";
import { myBusinesses } from "../../../services/api";

export default function ProfileBusinessTab() {
  async function fetchData(page: number): Promise<Page<BusinessDetailed>> {
    return await myBusinesses(page, 10);
  }

  return (
    <BusinessList pageSupplier={fetchData}/>
  );
}

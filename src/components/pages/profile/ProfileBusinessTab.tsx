import axios from "axios";
import BusinessList from "../../parts/BusinessList";
import { Page } from "../../../domain/Page";
import { BusinessDetailed } from "../../../domain/Business";
import { myBusinesses } from "../../../services/api";
import { stubBusiness } from "../../../services/stubbings";

export default function ProfileBusinessTab() {
  async function fetchData(page: number): Promise<Page<BusinessDetailed>> {
    const businesses = await myBusinesses(page, 10);
    return {
      content: businesses.content.map(stubBusiness),
      totalPages: businesses.totalPages
    };
  }

  return (
    <BusinessList pageSupplier={fetchData}/>
  );
}

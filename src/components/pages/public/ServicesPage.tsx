import ServiceList from "../../parts/ServiceList";
import { Page } from "../../../domain/Page";
import { ServiceDetailed } from "../../../domain/Service";
import { activeServices } from "../../../services/api";

export default function ServicesPage() {
  async function fetchData(page: number): Promise<Page<ServiceDetailed>> {
    return activeServices(page, 10);
  }

  async function fetchDataWithName(name: string, page: number): Promise<Page<ServiceDetailed>> {
    // TODO: adjust, when server implements search
    return await fetchData(page);
  }

  return (
    <ServiceList pageSupplier={fetchData} searchPageSupplier={fetchDataWithName}/>
  );
}

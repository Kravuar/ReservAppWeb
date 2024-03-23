import ServiceList from "../../parts/ServiceList";
import { Page } from "../../../domain/Page";
import { ServiceDetailed } from "../../../domain/Service";
import { activeServices, businessById } from "../../../services/api";
import { stubBusiness, stubService } from "../../../services/stubbings";

export default function ServiceTab() {
  async function fetchData(page: number): Promise<Page<ServiceDetailed>> {
    const services = await activeServices(page, 10);
    return {
      content: await Promise.all(services.content.map(async (service) => {
        const detailedBusiness = stubBusiness(await businessById(service.business.id));
        return stubService(service, detailedBusiness);
      })),
      totalPages: services.totalPages
    };
  }

  async function fetchDataWithName(name: string, page: number): Promise<Page<ServiceDetailed>> {
    // TODO: adjust, when server implements search
    return await fetchData(page);
  }

  return (
    <ServiceList pageSupplier={fetchData} searchPageSupplier={fetchDataWithName}/>
  );
}

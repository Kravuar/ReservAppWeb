import ServiceList from "../../parts/ServiceList";
import { Page } from "../../../domain/Page";
import { ServiceDetailed } from "../../../domain/Service";
import { activeServices } from "../../../services/api";
import { useAlert } from "../../util/Alert";
import ServiceWithBusinessCard from "../../parts/ServiceWithBusinessCard";

export default function ServicesPage() {
  const { withErrorAlert } = useAlert();
  
  async function fetchData(page: number): Promise<Page<ServiceDetailed>> {
    return withErrorAlert(() => activeServices(page, 10));
  }

  async function fetchDataWithName(_: string, page: number): Promise<Page<ServiceDetailed>> {
    // TODO: adjust, when server implements search
    return await fetchData(page);
  }

  return (
    <ServiceList searchPageSupplier={fetchDataWithName} CardComponent={(props) => <ServiceWithBusinessCard service={props.item}/>}/>
  );
}

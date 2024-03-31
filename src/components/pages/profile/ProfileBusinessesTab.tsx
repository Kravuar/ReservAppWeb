import BusinessList from "../../parts/BusinessList";
import { Page } from "../../../domain/Page";
import { BusinessDetailed } from "../../../domain/Business";

export default function ProfileBusinessesTab({pageSupplier}: {pageSupplier: (page:number) => Promise<Page<BusinessDetailed>>}) {

  return (
    <BusinessList pageSupplier={pageSupplier}/>
  );
}

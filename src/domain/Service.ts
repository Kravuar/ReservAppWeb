import { BusinessDetailed } from "./Business";

export class ServiceDetailed {
  constructor(
    public id: number,
    public business: BusinessDetailed,
    public active: boolean,
    public picture: string,
    public rating: number,
    public name: string,
    public description?: string
  ) {}
}

export class Service {
  constructor(
    public id: number,
    public business: ServiceBusiness,
    public active: boolean,
    public name: string,
    public description?: string
  ) {}
}

export class ServiceFormData {
  constructor(
    public businessId: number,
    public name: string,
    public description?: string,
    public picture?: File
  ) {}
}

export class ServiceBusiness {
  constructor(public id: number, public ownerSub: string) {}
}

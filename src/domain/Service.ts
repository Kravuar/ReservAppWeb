import { faker } from "@faker-js/faker";
import { Business } from "./Business";

export class Service {
  picture?: string;
  rating?: number;

  constructor(
    public id?: number,
    public business?: Business,
    public active?: boolean,
    public name?: string,
    public description?: string
  ) {
    this.picture = faker.image.urlPicsumPhotos();
    this.rating = faker.number.float({ fractionDigits: 2, min: 1, max: 5 })
  }
}

export class ServiceFormData {
  constructor(
    public businessId: number,
    public name: string,
    public description?: string,
    public picture?: File
  ) {}
}

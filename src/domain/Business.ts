import { faker } from "@faker-js/faker";

export class Business{
  picture?: string;
  rating?: number;

  constructor(
    public id?: number,
    public name?: string,
    public ownerSub?: string,
    public active?: boolean,
    public description?: string
  ) {
    this.picture = faker.image.urlPicsumPhotos();
    this.rating = faker.number.float({ fractionDigits: 2, min: 1, max: 5 })
  }
}

export class BusinessFormData {
  constructor(
    public name: string,
    public picture?: File,
    public description?: string,
  ) {}
}
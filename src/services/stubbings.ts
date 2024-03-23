// TODO: Remove this when picture and rating is implemented on server

import { BusinessDetailed } from './../domain/Business';
import { faker } from "@faker-js/faker";
import { Business } from "../domain/Business";
import { Service, ServiceDetailed } from "../domain/Service";

export function stubService(service: Service, business: BusinessDetailed): ServiceDetailed {
  return {
    ...service,
    business: business,
    picture: faker.image.url(),
    rating: faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
  };
}

export function stubBusiness(business: Business): BusinessDetailed {
  return {
    ...business,
    picture: faker.image.url(),
    rating: faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
  };
}

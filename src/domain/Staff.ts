import { LocalDateTime } from "@js-joda/core";
import { Business } from "./Business";
import { faker } from "@faker-js/faker";
import { ReservationSlot } from "./Schedule";

export class Staff {
  picture?: string;
  rating?: number;

  constructor(
    public id?: number,
    public sub?: string,
    public name?: string,
    public description?: string,
    public active?: boolean,
    public business?: Business,
    public schedule?: ReservationSlot[]
  ) {
    this.picture = faker.image.avatar();
    this.rating = faker.number.float({ fractionDigits: 2, min: 1, max: 5 })
  }
}

export enum InvitationStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  WAITING = "WAITING",
}

export class StaffInvitation {
  createdAt?: LocalDateTime;

  constructor(
    public id?: number,
    public sub?: string,
    public status?: InvitationStatus,
    public business?: Business,
    createdAt?: string
  ) {
    if (createdAt)
      this.createdAt = LocalDateTime.parse(createdAt);
  }
}
import { LocalDateTime } from "@js-joda/core";
import { BusinessDetailed } from "./Business";

export class Staff {
  constructor(
    public id: number,
    public sub: string,
    public name: string,
    public description: string,
    public picture: string,
    public rating: number,
    public business: StaffBusiness,
    public active: boolean
  ) {}
}

export enum InvitationStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  WAITING = "WAITING",
}

export class StaffInvitation {
  id: number;
  sub: string;
  business: StaffBusiness;
  createdAt: LocalDateTime;
  status: InvitationStatus;

  constructor(
    id: number,
    sub: string,
    business: StaffBusiness,
    createdAt: string | LocalDateTime,
    status: InvitationStatus
  ) {
    this.id = id;
    this.sub = sub;
    this.business = business;
    this.createdAt =
      createdAt instanceof LocalDateTime
        ? createdAt
        : LocalDateTime.parse(createdAt);
    this.status = status;
  }
}

export class StaffInvitationDetailed {
  createdAt: LocalDateTime;

  constructor(
    public id: number,
    public sub: string,
    public business: BusinessDetailed,
    createdAt: string | LocalDateTime,
    public status: InvitationStatus
  ) {
    this.createdAt = 
    createdAt instanceof LocalDateTime
        ? createdAt
        : LocalDateTime.parse(createdAt);
  }
}

export class StaffBusiness {
  constructor(public id: number, public ownerSub: string) {}
}

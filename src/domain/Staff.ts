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
  constructor(
    public id: number,
    public sub: string,
    public business: StaffBusiness,
    public createdAt: string,
    public status: InvitationStatus
  ) {}
}

export class StaffInvitationDetailed {
  constructor(
    public id: number,
    public sub: string,
    public business: BusinessDetailed,
    public createdAt: LocalDateTime,
    public status: InvitationStatus
  ) {}
}

export class StaffBusiness {
  constructor(public id: number, public ownerSub: string) {}
}

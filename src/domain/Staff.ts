import { LocalDateTime } from "@js-joda/core";

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
  ACCEPTED,
  DECLINED,
  WAITING,
}

export class StaffInvitation {
  constructor(
    public id: number,
    public sub: string,
    public business: StaffBusiness,
    public createdAt: LocalDateTime,
    public status: InvitationStatus
  ) {}
}

export class StaffBusiness {
  constructor(public id: number, public ownerSub: string) {}
}

import { Service } from "./Service";
import { Staff } from "./Staff";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";

export class ScheduleByService {
  constructor(
    public staff: ScheduleStaff,
    public schedule: Map<LocalDate, ReservationSlotDetailed[]>
  ) {}
}

export class ReservationSlotDetailed {
  constructor(
    public start: LocalTime,
    public end: LocalTime,
    public cost: number,
    public maxReservations: number,
    public reservationsLeft: number,
    public staff: Staff
  ) {
  }
}

export class ScheduleService {
  constructor(public id: number, public business: ScheduleBusiness) {}
}

export class ScheduleBusiness {
  constructor(public id: number, public ownerSub: string) {}
}

export class ScheduleStaff {
  constructor(public id: number, public business: ScheduleBusiness) {}
}

export class ReservationDetailed {
  constructor(
    public id: number,
    public date: LocalDate,
    public start: LocalTime,
    public end: LocalTime,
    public staff: Staff,
    public service: Service,
    public active: boolean,
    public createdAt: LocalDateTime
  ) {}
}

export class Reservation {
  constructor(
    public id: number,
    public date: LocalDate,
    public start: LocalTime,
    public end: LocalTime,
    public staff: ScheduleStaff,
    public service: ScheduleService,
    public active: boolean,
    public createdAt: LocalDateTime
  ) {}
}

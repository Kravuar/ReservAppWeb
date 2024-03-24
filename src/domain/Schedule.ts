import { Staff } from "./Staff";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";

export class ScheduleByService {
  constructor(
    public staff: ScheduleStaff,
    public schedule: ScheduleByServiceAndStaff
  ) {}
}

export type ScheduleByServiceAndStaff = Map<LocalDate, ReservationSlot[]>;

export class ReservationSlot {
  constructor(
    public start: LocalTime,
    public end: LocalTime,
    public cost: number,
    public maxReservations: number
  ) {}
}

export class ReservationSlotDetailed extends ReservationSlot {
  constructor(
    public start: LocalTime,
    public end: LocalTime,
    public cost: number,
    public maxReservations: number,
    public reservationsLeft: number,
    public staff?: Staff
  ) {
    super(start, end, cost, maxReservations);
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

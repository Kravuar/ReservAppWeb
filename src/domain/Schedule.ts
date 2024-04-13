import { Service } from "./Service";
import { Staff } from "./Staff";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";

export class ScheduleByService {
  schedule : Map<LocalDate, ReservationSlotDetailed[]>;

  constructor(
    public staff: ScheduleStaff,
    schedule: Map<string | LocalDate, ReservationSlotDetailed[]>
  ) {
    this.schedule = new Map(Array.from(schedule.entries(), ([key, value]) => [
      key instanceof LocalDate
        ? key
        : LocalDate.parse(key),
      value
    ]));
  }
}

export class ScheduleExceptionDay {
  date: LocalDate;

  constructor(
    date: string | LocalDate,
    public id: number,
    public staff: ScheduleStaff,
    public service: ScheduleService,
    public reservationSlots: ReservationSlot[]
  ) {
    this.date = date instanceof LocalDate ? date : LocalDate.parse(date);
  }
}

export class ScheduleFormData {
  constructor(
    public start: LocalDate,
    public end: LocalDate,
    public patterns: SchedulePatternFormData[]
  ) {}
}

export class SchedulePatternFormData {
  constructor(
    public repeatDays: number,
    public pauseDays: number,
    public reservationSlots: ReservationSlot[]
  ) {}
}

export class Schedule {
  start: LocalDate;
  end: LocalDate;
  createdAt: LocalDateTime;

  constructor(
    start: string | LocalDate,
    end: string | LocalDate,
    public id: number,
    public staff: ScheduleStaff,
    public service: ScheduleService,
    public patterns: SchedulePattern[],
    createdAt: string | LocalDateTime,
  ) {
    this.start = start instanceof LocalDate ? start : LocalDate.parse(start);
    this.end = end instanceof LocalDate ? end : LocalDate.parse(end);
    this.createdAt = createdAt instanceof LocalDateTime ? createdAt : LocalDateTime.parse(createdAt);
  }
}

export class SchedulePattern {
  constructor(
    public id: number,
    public repeatDays: number,
    public pauseDays: number,
    public reservationSlots: ReservationSlot[]
  ) {}
}

export class ReservationSlot {
  start: LocalTime;
  end: LocalTime;

  constructor(
    start: string | LocalTime,
    end: string | LocalTime,
    public cost: number,
    public maxReservations: number
  ) {
    this.start = start instanceof LocalTime ? start : LocalTime.parse(start);
    this.end = end instanceof LocalTime ? end : LocalTime.parse(end);
  }
}

export class ReservationSlotDetailed extends ReservationSlot {
  constructor(
    start: string | LocalTime,
    end: string | LocalTime,
    cost: number,
    maxReservations: number,
    public reservationsLeft: number,
    public staff: Staff
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

export class ReservationDetailed {
  date: LocalDate;
  start: LocalTime;
  end: LocalTime;
  createdAt: LocalDateTime;
  
  constructor(
    public id: number,
    date: string | LocalDate,
    start: string | LocalTime,
    end: string | LocalTime,
    public staff: Staff,
    public service: Service,
    public active: boolean,
    createdAt: string | LocalDateTime
  ) {
    this.start = start instanceof LocalTime ? start : LocalTime.parse(start);
    this.end = end instanceof LocalTime ? end : LocalTime.parse(end);
    this.date = date instanceof LocalDate ? date : LocalDate.parse(date);
    this.createdAt = createdAt instanceof LocalDateTime ? createdAt : LocalDateTime.parse(createdAt);
  }
}

export class ReservationFromClientDetailed extends ReservationDetailed {
  constructor(
    id: number,
    date: LocalDate,
    start: LocalTime,
    end: LocalTime,
    public clientSub: string,
    staff: Staff,
    service: Service,
    active: boolean,
    createdAt: LocalDateTime
  ) {
    super(id, date, start, end, staff, service, active, createdAt);
  }
}

export class Reservation {
  date: LocalDate;
  start: LocalTime;
  end: LocalTime;
  createdAt: LocalDateTime;

  constructor(
    public id: number,
    date: string | LocalDate,
    start: string | LocalTime,
    end: string | LocalTime,
    public staff: ScheduleStaff,
    public service: ScheduleService,
    public active: boolean,
    createdAt: string | LocalDateTime
  ) {
    this.date = date instanceof LocalDate ? date : LocalDate.parse(date);
    this.start = start instanceof LocalTime ? start : LocalTime.parse(start);
    this.end = end instanceof LocalTime ? end : LocalTime.parse(end);
    this.createdAt = createdAt instanceof LocalDateTime ? createdAt : LocalDateTime.parse(createdAt);
  }
}

export class ReservationFromClient extends Reservation {
  constructor(
    id: number,
    date: string | LocalDate,
    start: string | LocalTime,
    end: string | LocalTime,
    public clientSub: string,
    staff: ScheduleStaff,
    service: ScheduleService,
    active: boolean,
    createdAt: string | LocalDateTime
  ) {
    super(id, date, start, end, staff, service, active, createdAt);
  }
}

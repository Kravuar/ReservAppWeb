import { Service } from "./Service";
import { Staff } from "./Staff";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";

export class ScheduleExceptionDay {
  date?: LocalDate;

  constructor(
    date?: string | LocalDate,
    public id?: number,
    public staff?: Staff,
    public service?: Service,
    public reservationSlots?: ReservationSlot[]
  ) {
    if (date)
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
  start?: LocalDate;
  end?: LocalDate;
  createdAt?: LocalDateTime;

  constructor(
    start?: string | LocalDate,
    end?: string  | LocalDate,
    createdAt?: string | LocalDateTime,
    public id?: number,
    public staff?: Staff,
    public service?: Service,
    public patterns?: SchedulePattern[]
  ) {
    if (start)
      this.start = start instanceof LocalDate ? start : LocalDate.parse(start);
    if (end)
      this.end = end instanceof LocalDate ? end : LocalDate.parse(end);
    if (createdAt)
      this.createdAt = createdAt instanceof LocalDateTime ? createdAt : LocalDateTime.parse(createdAt);
  }
}

export class SchedulePattern {
  constructor(
    public id?: number,
    public repeatDays?: number,
    public pauseDays?: number,
    public reservationSlots?: ReservationSlot[]
  ) {}
}

export class ReservationSlotFormData {
  constructor(
    public start: LocalTime,
    public end: LocalTime,
    public date: LocalDate,
    public cost: number,
    public maxReservations: number,
  ) {}
}

export class ReservationSlot {
  start?: LocalTime;
  end?: LocalTime;
  date?: LocalDate;

  constructor(
    start?: string | LocalTime,
    end?: string | LocalTime,
    date?: string | LocalDate,
    public cost?: number,
    public maxReservations?: number,
    public reservationsLeft?: number,
    public service?: Service,
    public staff?: Staff
  ) {
    if (start)
      this.start = start instanceof LocalTime ? start : LocalTime.parse(start);
    if (end)
      this.end = end instanceof LocalTime ? end : LocalTime.parse(end);
    if (date)
      this.date = date instanceof LocalDate ? date : LocalDate.parse(date);
  }
}

export class Reservation {
  date?: LocalDate;
  start?: LocalTime;
  end?: LocalTime;
  createdAt?: LocalDateTime;

  constructor(
    public id?: number,
    start?: string | LocalTime,
    end?: string | LocalTime,
    date?: string | LocalDate,
    createdAt?: string | LocalDateTime,
    public cost?: number,
    public staff?: Staff,
    public service?: Service,
    public clientSub?: string
  ) {
    if (start)
      this.start = start instanceof LocalTime ? start : LocalTime.parse(start);
    if (end)
      this.end = end instanceof LocalTime ? end : LocalTime.parse(end);
    if (date)
      this.date = date instanceof LocalDate ? date : LocalDate.parse(date);
    if (createdAt)
      this.createdAt = createdAt instanceof LocalDateTime ? createdAt : LocalDateTime.parse(createdAt);
  }
}
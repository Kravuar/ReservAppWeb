import { faker } from "@faker-js/faker";
import axios from "axios";
import { BusinessDetailed } from "../domain/Business";
import { Page } from "../domain/Page";
import { Service, ServiceDetailed } from "../domain/Service";
import { Staff, StaffBusiness } from "../domain/Staff";
import {
  Reservation,
  ReservationSlotDetailed,
  ScheduleService,
  ScheduleStaff,
} from "../domain/Schedule";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";

function paginationAdjustment(page: number): number {
  return page - 1;
}

async function detailedService(service: Service) {
  const business = await businessById(service.business.id);

  return new ServiceDetailed(
    service.id,
    business,
    service.active,
    faker.image.url(), // TODO: adjust, when server implements attributes
    faker.number.float({ fractionDigits: 2, min: 1, max: 5 }), // TODO: adjust, when server implements attributes
    service.name,
    service.description
  );
}

function combineSlots(
  slots: Array<[string, ReservationSlotDetailed[]]>
): Map<LocalDate, ReservationSlotDetailed[]> {
  const combined = slots.reduce((acc, [dateStr, slots]) => {
    const existingSlots = acc.get(dateStr) || [];
    acc.set(dateStr, [...existingSlots, ...slots]);
    return acc;
  }, new Map<string, ReservationSlotDetailed[]>());

  combined.forEach((slots) =>
    slots.sort((first, second) => first.start.compareTo(second.start))
  );

  return new Map(
    Array.from(combined.entries(), ([dateStr, slots]) => [
      LocalDate.parse(dateStr),
      slots,
    ])
  );
}

export async function businessById(id: number): Promise<BusinessDetailed> {
  const response = await axios.get<RealBusiness>(
    `business/api-v1/retrieval/by-id/${id}`
  );
  return stubBusiness(response.data);
}

export async function myBusinessById(id: number): Promise<BusinessDetailed> {
  const response = await axios.get<RealBusiness>(
    `business/api-v1/retrieval/my/by-id/${id}`
  );
  return stubBusiness(response.data);
}

export async function businessesByOwner(
  ownerSub: string,
  page: number,
  pageSize: number
): Promise<Page<BusinessDetailed>> {
  const response = await axios.get<Page<RealBusiness>>(
    `business/api-v1/retrieval/by-owner/${ownerSub}/${paginationAdjustment(
      page
    )}/${pageSize}`
  );

  return {
    content: response.data.content.map(stubBusiness),
    totalPages: response.data.totalPages,
  };
}

export async function myBusinesses(
  page: number,
  pageSize: number
): Promise<Page<BusinessDetailed>> {
  const response = await axios.get<Page<RealBusiness>>(
    `business/api-v1/retrieval/my/${paginationAdjustment(page)}/${pageSize}`
  );

  return {
    content: response.data.content.map(stubBusiness),
    totalPages: response.data.totalPages,
  };
}

export async function activeBusinesses(
  page: number,
  pageSize: number
): Promise<Page<BusinessDetailed>> {
  const response = await axios.get<Page<RealBusiness>>(
    `business/api-v1/retrieval/active/${paginationAdjustment(page)}/${pageSize}`
  );

  return {
    content: response.data.content.map(stubBusiness),
    totalPages: response.data.totalPages,
  };
}

export async function serviceById(id: number): Promise<ServiceDetailed> {
  return detailedService(
    (await axios.get<Service>(`services/api-v1/retrieval/by-id/${id}`)).data
  );
}

export async function myServiceById(id: number): Promise<ServiceDetailed> {
  return detailedService(
    (await axios.get<Service>(`services/api-v1/retrieval/my/by-id/${id}`)).data
  );
}

export async function activeServices(
  page: number,
  pageSize: number
): Promise<Page<ServiceDetailed>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/retrieval/active/${paginationAdjustment(page)}/${pageSize}`
  );
  return {
    content: await Promise.all(response.data.content.map(detailedService)),
    totalPages: response.data.totalPages,
  };
}

export async function servicesByBusiness(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<ServiceDetailed>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/retrieval/by-business/${businessId}/${paginationAdjustment(
      page
    )}/${pageSize}`
  );
  return {
    content: await Promise.all(response.data.content.map(detailedService)),
    totalPages: response.data.totalPages,
  };
}

export async function myServicesByBusiness(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<ServiceDetailed>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/retrieval/my/by-business/${businessId}/${paginationAdjustment(
      page
    )}/${pageSize}`
  );
  return {
    content: await Promise.all(response.data.content.map(detailedService)),
    totalPages: response.data.totalPages,
  };
}

export async function staffById(staffId: number): Promise<Staff> {
  const response = await axios.get<RealStaff>(
    `staff/api-v1/retrieval/by-id/${staffId}`
  );
  return stubStaff(response.data);
}

export async function staffByBusinessId(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<Staff>> {
  const response = await axios.get<Page<RealStaff>>(
    `staff/api-v1/retrieval/by-business/${businessId}/${paginationAdjustment(
      page
    )}/${pageSize}`
  );
  return {
    content: await Promise.all(response.data.content.map(stubStaff)),
    totalPages: response.data.totalPages,
  };
}

export async function reservationsByServiceAndStaff(
  serviceId: number,
  staffId: number,
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, Reservation[]>> {
  const response = await axios.get<ReservationsDTO>(
    `schedule/api-v1/reservation/retrieval/by-service-and-staff/${serviceId}/${staffId}/${from}/${to}`
  );
  const reservations = response.data;
  return new Map(
    Array.from(Object.keys(reservations), (date) => [
      LocalDate.parse(date),
      reservations[date].map(
        (reservation) =>
          new Reservation(
            reservation.id,
            LocalDate.parse(reservation.date),
            LocalTime.parse(reservation.start),
            LocalTime.parse(reservation.end),
            reservation.staff,
            reservation.service,
            reservation.active,
            LocalDateTime.parse(reservation.createdAt)
          )
      ),
    ])
  );
}

export async function reservationsByService(
  serviceId: number,
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, Reservation[]>> {
  const response = await axios.get<ReservationsDTO>(
    `schedule/api-v1/reservation/retrieval/by-service/${serviceId}/${from}/${to}`
  );
  const reservations = response.data;
  return new Map(
    Array.from(Object.keys(reservations), (date) => [
      LocalDate.parse(date),
      reservations[date].map(
        (reservation) =>
          new Reservation(
            reservation.id,
            LocalDate.parse(reservation.date),
            LocalTime.parse(reservation.start),
            LocalTime.parse(reservation.end),
            reservation.staff,
            reservation.service,
            reservation.active,
            LocalDateTime.parse(reservation.createdAt)
          )
      ),
    ])
  );
}

export async function scheduleByServiceAndStaff(
  serviceId: number,
  staffId: number,
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, ReservationSlotDetailed[]>> {
  const response = await axios.get<ScheduleDTO>(
    `schedule/api-v1/retrieval/by-service-and-staff/${serviceId}/${staffId}/${from}/${to}`
  );
  const reservations = await reservationsByServiceAndStaff(
    serviceId,
    staffId,
    from,
    to
  );
  return scheduleToDetailed(staffId, response.data, reservations);
}

export async function scheduleByService(
  serviceId: number,
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, ReservationSlotDetailed[]>> {
  const response = await axios.get<SchedulesByServiceDTO[]>(
    `schedule/api-v1/retrieval/by-service/${serviceId}/${from}/${to}`
  );
  const reservations = await reservationsByService(serviceId, from, to);

  const mappedSchedules = await Promise.all(
    response.data.map(async ({ staff, schedule }) =>
      scheduleToDetailed(staff.id, schedule, reservations)
    )
  );

  // Bullshit, js joda sucks
  const bullshit = combineSlots(
    Array.from(
      mappedSchedules.flatMap((map) => Array.from(map.entries())),
      ([date, slots]) => [date.toString(), slots.flat()]
    )
  );

  return bullshit;
}

export async function reserveSlot(
  staffId: number,
  serviceId: number,
  dateTime: LocalDateTime
) {
  const response = await axios.post<Reservation>(
    `schedule/api-v1/reservation/management/reserve/${staffId}/${serviceId}/${dateTime}`
  );
  return response.data;
}

async function scheduleToDetailed(
  staffId: number,
  schedule: ScheduleDTO,
  reservations: Map<LocalDate, Reservation[]>
): Promise<Map<LocalDate, ReservationSlotDetailed[]>> {
  const staff = await staffById(staffId);

  return new Map(
    Array.from(Object.keys(schedule), (dateStr) => {
      const slotsDTO = schedule[dateStr];
      const date = LocalDate.parse(dateStr);
      return [
        date,
        slotsDTO.map((slot) => {
          const sameDayReservations = jodaTsMapIsRetardedGet(
            date,
            reservations
          );
          const start = LocalTime.parse(slot.start);
          const end = LocalTime.parse(slot.end);
          const reservationsCount = sameDayReservations
            ? sameDayReservations.filter(
                (reservation) =>
                  reservation.staff.id === staffId &&
                  reservation.start.equals(start)
              ).length
            : 0;
          return new ReservationSlotDetailed(
            start,
            end,
            slot.cost,
            slot.maxReservations,
            slot.maxReservations - reservationsCount,
            staff
          );
        }),
      ];
    })
  );
}

class SchedulesByServiceDTO {
  constructor(public staff: ScheduleStaff, public schedule: ScheduleDTO) {}
}

class ReservationSlotDTO {
  constructor(
    public start: string,
    public end: string,
    public cost: number,
    public maxReservations: number
  ) {}
}

class ReservationDTO {
  constructor(
    public id: number,
    public date: string,
    public start: string,
    public end: string,
    public staff: ScheduleStaff,
    public service: ScheduleService,
    public active: boolean,
    public createdAt: string
  ) {}
}

class ScheduleDTO {
  [date: string]: ReservationSlotDTO[];
}

class ReservationsDTO {
  [date: string]: ReservationDTO[];
}

export function jodaTsMapIsRetardedGet<V>(
  date: LocalDate,
  map: Map<LocalDate, V>
): V | null {
  for (var entry of map.entries()) if (entry[0].equals(date)) return entry[1];
  return null;
}

// TODO: remove stubbings and adjust api calls when server implements attributes
//
// ===============================================================================
// ===============================================================================
// ===============================================================================
//

class RealBusiness {
  constructor(
    public id: number,
    public name: string,
    public ownerSub: string,
    public active: boolean,
    public description?: string
  ) {}
}

function stubBusiness(business: RealBusiness): BusinessDetailed {
  return new BusinessDetailed(
    business.id,
    business.name,
    business.ownerSub,
    business.active,
    faker.image.url(),
    faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
    business.description
  );
}

class RealStaff {
  constructor(
    public id: number,
    public sub: string,
    public name: string,
    public description: string,
    public business: StaffBusiness,
    public active: boolean
  ) {}
}

async function stubStaff(staff: RealStaff) {
  return new Staff(
    staff.id,
    staff.sub,
    staff.name,
    staff.description,
    faker.image.url(),
    faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
    staff.business,
    staff.active
  );
}

import { faker } from "@faker-js/faker";
import axios from "axios";
import { BusinessDetailed } from "../domain/Business";
import { Page } from "../domain/Page";
import { Service, ServiceDetailed } from "../domain/Service";
import { Staff, StaffBusiness } from "../domain/Staff";
import {
  Reservation,
  ReservationSlot,
  ReservationSlotDetailed,
  ScheduleByService,
} from "../domain/Schedule";
import { LocalDate } from "@js-joda/core";

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
    `staff/api-v1/retrieval/my/by-id/${staffId}`
  );
  return stubStaff(response.data);
}

export async function staffByBusinessId(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<Staff>> {
  const response = await axios.get<Page<RealStaff>>(
    `staff/api-v1/retrieval/my/by-business/${businessId}/${paginationAdjustment(
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
  const response = await axios.get<Map<LocalDate, Reservation[]>>(
    `schedule/api-v1/reservation/retrieval/by-service-and-staff/${serviceId}/${staffId}/${from}/${to}`
  );
  return response.data;
}

export async function reservationsByService(
  serviceId: number,
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, Reservation[]>> {
  const response = await axios.get<Map<LocalDate, Reservation[]>>(
    `schedule/api-v1/reservation/retrieval/by-service/${serviceId}/${from}/${to}`
  );
  return response.data;
}

export async function scheduleByServiceAndStaff(
  serviceId: number,
  staffId: number,
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, ReservationSlotDetailed[]>> {
  const response = await axios.get<Map<LocalDate, ReservationSlot[]>>(
    `schedule/api-v1/retrieval/my/by-service-and-staff/${serviceId}/${staffId}/${from}/${to}`
  );
  const reservations = await reservationsByServiceAndStaff(
    serviceId,
    staffId,
    from,
    to
  );
  const staff = await staffById(staffId);
  return new Map(
    Array.from(response.data, ([date, slots]) => [
      date,
      slots.map((slot) => {
        const sameDayReservations = reservations.get(date);
        const reservationsCount = sameDayReservations
          ? sameDayReservations.filter(
              (reservation) => reservation.start === slot.start
            ).length
          : 0;
        return new ReservationSlotDetailed(
          slot.start,
          slot.end,
          slot.cost,
          slot.maxReservations,
          reservationsCount,
          staff
        );
      }),
    ])
  );
}

export async function scheduleByService(
  serviceId: number,
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, ReservationSlotDetailed[]>> {
  const response = await axios.get<ScheduleByService[]>(
    `schedule/api-v1/retrieval/my/by-service/${serviceId}/${from}/${to}`
  );
  const reservations = await reservationsByService(serviceId, from, to);

  const mappedSchedules = await Promise.all(
    response.data.map(async ({ staff, schedule }) => {
      const staffDetailed = await staffById(staff.id);

      return new Map(Array.from(schedule, ([date, slots]) => [
        date,
        slots.map((slot) => {
          const sameDayReservations = reservations.get(date);
          const reservationsCount = sameDayReservations
            ? sameDayReservations.filter(
                (reservation) => reservation.start === slot.start
              ).length
            : 0;
          return new ReservationSlotDetailed(
            slot.start,
            slot.end,
            slot.cost,
            slot.maxReservations,
            reservationsCount,
            staffDetailed
          );
        }),
      ]));
    })
  );

  return new Map(
    Array.from(mappedSchedules.flatMap(map => Array.from(map.entries())),
      ([date, slots]) => [
        date,
        slots.flat(),
      ]
    )
  );
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
    public business: StaffBusiness,
    public active: boolean
  ) {}
}

async function stubStaff(staff: RealStaff) {
  return new Staff(
    staff.id,
    staff.sub,
    staff.name,
    faker.image.url(),
    faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
    staff.business,
    staff.active
  );
}

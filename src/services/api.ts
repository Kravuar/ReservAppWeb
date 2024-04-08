import { faker } from "@faker-js/faker";
import axios from "axios";
import { BusinessDetailed, BusinessFormData } from "../domain/Business";
import { Page } from "../domain/Page";
import { Service, ServiceDetailed, ServiceFormData } from "../domain/Service";
import { Staff, StaffBusiness, StaffInvitation, StaffInvitationDetailed } from "../domain/Staff";
import {
  Reservation,
  ReservationDetailed,
  ReservationFromClient,
  ReservationFromClientDetailed,
  ReservationSlotDetailed,
  ScheduleService,
  ScheduleStaff,
} from "../domain/Schedule";
import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";

function paginationAdjustment(page: number): number {
  return page - 1;
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

async function megaDetailedReservationsDTO(
  reservations: ReservationsDTO
): Promise<Map<LocalDate, ReservationDetailed[]>> {
  const dates = Object.keys(reservations);
  const staffs = await detailedStaffs(
    dates
      .flatMap((date) => reservations[date])
      .map((reservation) => reservation.staff.id)
  );
  const businesses = await detailedBusinesses(
    dates
      .flatMap((date) => reservations[date])
      .map((reservation) => reservation.service.business.id)
  );
  const services = await detailedServicesByIds(
    dates
      .flatMap((date) => reservations[date])
      .map((reservation) => reservation.service.id),
    businesses
  );
  const reservationData = await Promise.all(
    dates.map(async (date) =>
      megaDetailedReservations(
        reservations[date].map(detailedReservation),
        staffs,
        services
      )
    )
  );

  // Fuck it
  return new Map(
    Array.from(dates, (date, index) => [
      LocalDate.parse(date),
      reservationData[index],
    ])
  );
}

// Will be hard to reuse code when this dto will gain more client info
async function megaDetailedReservationsFromClientDTO(
  reservations: ReservationsFromClientDTO
): Promise<Map<LocalDate, ReservationFromClientDetailed[]>> {
  const dates = Object.keys(reservations);
  const staffs = await detailedStaffs(
    dates
      .flatMap((date) => reservations[date])
      .map((reservation) => reservation.staff.id)
  );
  const businesses = await detailedBusinesses(
    dates
      .flatMap((date) => reservations[date])
      .map((reservation) => reservation.service.business.id)
  );
  const services = await detailedServicesByIds(
    dates
      .flatMap((date) => reservations[date])
      .map((reservation) => reservation.service.id),
    businesses
  );
  const reservationData = await Promise.all(
    dates.map(async (date) =>
      megaDetailedReservationsFromClient(
        reservations[date].map(detailedReservationFromClient),
        staffs,
        services
      )
    )
  );

  // Fuck it
  return new Map(
    Array.from(dates, (date, index) => [
      LocalDate.parse(date),
      reservationData[index],
    ])
  );
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

async function detailedInvitations(invitations: Page<StaffInvitation>): Promise<Page<StaffInvitationDetailed>> {
  const businesses = await detailedBusinesses(
    invitations.content
      .map((invitation) => invitation.business.id)
  );

  return {
    content: invitations.content.map(invitation => new StaffInvitationDetailed(
      invitation.id,
      invitation.sub,
      businesses.get(invitation.business.id)!,
      LocalDateTime.parse(invitation.createdAt),
      invitation.status
    )),
    totalPages: invitations.totalPages
  }
}

export async function detailedBusinessById(
  id: number
): Promise<BusinessDetailed> {
  const response = await axios.get<BusinessDTO>(
    `business/api-v1/retrieval/by-id/${id}`
  );
  return detailedBusiness(response.data);
}

export async function myDetailedBusinessById(
  id: number
): Promise<BusinessDetailed> {
  const response = await axios.get<BusinessDTO>(
    `business/api-v1/retrieval/my/by-id/${id}`
  );
  return detailedBusiness(response.data);
}

export async function myDetailedBusinesses(
  page: number,
  pageSize: number
): Promise<Page<BusinessDetailed>> {
  const response = await axios.get<Page<BusinessDTO>>(
    `business/api-v1/retrieval/my/${paginationAdjustment(page)}/${pageSize}`
  );

  return {
    content: response.data.content.map(detailedBusiness),
    totalPages: response.data.totalPages,
  };
}

export async function activeDetailedBusinesses(
  page: number,
  pageSize: number
): Promise<Page<BusinessDetailed>> {
  const response = await axios.get<Page<BusinessDTO>>(
    `business/api-v1/retrieval/active/${paginationAdjustment(page)}/${pageSize}`
  );

  return {
    content: response.data.content.map(detailedBusiness),
    totalPages: response.data.totalPages,
  };
}

export async function serviceById(id: number): Promise<Service> {
  return (await axios.get<Service>(`services/api-v1/retrieval/by-id/${id}`))
    .data;
}

export async function detailedServiceById(
  id: number
): Promise<ServiceDetailed> {
  return detailedService(
    (await axios.get<Service>(`services/api-v1/retrieval/by-id/${id}`)).data
  );
}

export async function myDetailedServiceById(
  id: number
): Promise<ServiceDetailed> {
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
  const services = response.data;

  const businesses = await detailedBusinesses(
    services.content.map((service) => service.business.id)
  );
  return {
    content: Array.from(
      (await detailedServices(services.content, businesses)).values()
    ),
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
  const services = response.data;

  const businesses = await detailedBusinesses(
    services.content.map((service) => service.business.id)
  );
  return {
    content: Array.from(
      (await detailedServices(services.content, businesses)).values()
    ),
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
  const services = response.data;

  const businesses = await detailedBusinesses(
    services.content.map((service) => service.business.id)
  );
  return {
    content: Array.from(
      (await detailedServices(services.content, businesses)).values()
    ),
    totalPages: response.data.totalPages,
  };
}

export async function staffById(staffId: number): Promise<Staff> {
  const response = await axios.get<StaffDTO>(
    `staff/api-v1/retrieval/by-id/${staffId}`
  );
  return detailedStaff(response.data);
}

export async function staffByBusinessId(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<Staff>> {
  const response = await axios.get<Page<StaffDTO>>(
    `staff/api-v1/retrieval/by-business/${businessId}/${paginationAdjustment(
      page
    )}/${pageSize}`
  );
  return {
    content: await Promise.all(response.data.content.map(detailedStaff)),
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
      reservations[date].map(detailedReservation),
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
      reservations[date].map(detailedReservation),
    ])
  );
}

export async function myReservations(
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, ReservationDetailed[]>> {
  const response = await axios.get<ReservationsDTO>(
    `schedule/api-v1/reservation/retrieval/my/${from}/${to}`
  );
  return megaDetailedReservationsDTO(response.data);
}

export async function reservationsToMe(
  from: LocalDate,
  to: LocalDate
): Promise<Map<LocalDate, ReservationFromClientDetailed[]>> {
  const response = await axios.get<ReservationsFromClientDTO>(
    `schedule/api-v1/reservation/retrieval/to-me/${from}/${to}`
  );
  return megaDetailedReservationsFromClientDTO(response.data);
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
): Promise<void> {
  await axios.post<Reservation>(
    `schedule/api-v1/reservation/management/reserve/${staffId}/${serviceId}/${dateTime}`
  );
  return;
}

export async function cancelReservation(reservationId: number) {
  await axios.delete<Reservation>(
    `schedule/api-v1/reservation/management/cancel/${reservationId}`
  );
  return;
}

export async function restoreReservation(reservationId: number) {
  await axios.post<Reservation>(
    `schedule/api-v1/reservation/management/restore/${reservationId}`
  );
  return;
}

export async function createBusiness(
  formData: BusinessFormData
): Promise<BusinessDetailed> {
  const response = await axios.post<BusinessDTO>(
    `business/api-v1/management/create`,
    formData
  );
  return detailedBusiness(response.data);
}

export async function createService(
  formData: ServiceFormData
): Promise<ServiceDetailed> {
  const response = await axios.post<Service>(
    `services/api-v1/management/create/${formData.businessId}`,
    {
      name: formData.name,
      description: formData.description,
    }
  );
  return detailedService(response.data);
}

export async function inviteStaff(
  subject: string,
  businessId: number
): Promise<StaffInvitation> {
  const response = await axios.post<StaffInvitation>(
    `staff/api-v1/management/send-invitation/${subject}/${businessId}`
  );
  return response.data;
}

export async function removeStaff(staffId: number): Promise<void> {
  const response = await axios.delete<void>(
    `staff/api-v1/management/remove-staff/${staffId}`
  );
  return response.data;
}

export async function acceptInvitation(invitationId: number): Promise<void> {
  const response = await axios.post<void>(
    `staff/api-v1/management/accept-invitation/${invitationId}`
  );
  return response.data;
}

export async function declineInvitation(invitationId: number): Promise<void> {
  const response = await axios.post<void>(
    `staff/api-v1/management/declline-invitation/${invitationId}`
  );
  return response.data;
}

export async function getMyInvitations(page: number, pageSize: number): Promise<Page<StaffInvitationDetailed>> {
  const response = await axios.get<Page<StaffInvitation>>(
    `staff/api-v1/retrieval//invitations-by-sub/${paginationAdjustment(page)}/${pageSize}`
  );

  return detailedInvitations(response.data);
}

export async function getInvitationsOfBusiness(businessId: number, page: number, pageSize: number): Promise<Page<StaffInvitationDetailed>> {
  const response = await axios.get<Page<StaffInvitation>>(
    `staff/api-v1/retrieval//invitations-by-business/${businessId}/${paginationAdjustment(page)}/${pageSize}`
  );
  
  return detailedInvitations(response.data);
}

class BusinessDTO {
  constructor(
    public id: number,
    public name: string,
    public ownerSub: string,
    public active: boolean,
    public description?: string
  ) {}
}

class StaffDTO {
  constructor(
    public id: number,
    public sub: string,
    public name: string,
    public description: string,
    public business: StaffBusiness,
    public active: boolean
  ) {}
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

class ReservationFromClientDTO {
  constructor(
    public id: number,
    public date: string,
    public start: string,
    public end: string,
    public clientSub: string,
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

class ReservationsFromClientDTO {
  [date: string]: ReservationFromClientDTO[];
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

async function detailedService(service: Service) {
  const business = await detailedBusinessById(service.business.id);

  return new ServiceDetailed(
    service.id,
    business,
    service.active,
    faker.image.url(),
    faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
    service.name,
    service.description
  );
}

async function detailedServicesByIds(
  serviceIds: number[],
  businessSupplier: Map<number, BusinessDetailed>
): Promise<Map<number, ServiceDetailed>> {
  const map = new Map<number, ServiceDetailed>();
  for (var serviceId of serviceIds)
    if (!map.get(serviceId)) {
      const service = await serviceById(serviceId);
      map.set(
        serviceId,
        new ServiceDetailed(
          service.id,
          businessSupplier.get(service.business.id)!,
          service.active,
          faker.image.url(),
          faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
          service.name,
          service.description
        )
      );
    }
  return map;
}

async function detailedServices(
  services: Service[],
  businessSupplier: Map<number, BusinessDetailed>
): Promise<Map<number, ServiceDetailed>> {
  const map = new Map<number, ServiceDetailed>();
  for (var service of services)
    if (!map.get(service.id)) {
      map.set(
        service.id,
        new ServiceDetailed(
          service.id,
          businessSupplier.get(service.business.id)!,
          service.active,
          faker.image.url(),
          faker.number.float({ fractionDigits: 2, min: 1, max: 5 }),
          service.name,
          service.description
        )
      );
    }
  return map;
}

function detailedReservation(reservation: ReservationDTO): Reservation {
  return new Reservation(
    reservation.id,
    LocalDate.parse(reservation.date),
    LocalTime.parse(reservation.start),
    LocalTime.parse(reservation.end),
    reservation.staff,
    reservation.service,
    reservation.active,
    LocalDateTime.parse(reservation.createdAt)
  );
}

function detailedReservationFromClient(
  reservation: ReservationFromClientDTO
): ReservationFromClient {
  return new ReservationFromClient(
    reservation.id,
    LocalDate.parse(reservation.date),
    LocalTime.parse(reservation.start),
    LocalTime.parse(reservation.end),
    reservation.clientSub,
    reservation.staff,
    reservation.service,
    reservation.active,
    LocalDateTime.parse(reservation.createdAt)
  );
}

async function megaDetailedReservations(
  reservations: Reservation[],
  staffSupplier: Map<number, Staff>,
  serviceSupplier: Map<number, ServiceDetailed>
): Promise<ReservationDetailed[]> {
  return reservations.map(
    (reservation) =>
      new ReservationDetailed(
        reservation.id,
        reservation.date,
        reservation.start,
        reservation.end,
        staffSupplier.get(reservation.staff.id)!,
        serviceSupplier.get(reservation.service.id)!,
        reservation.active,
        reservation.createdAt
      )
  );
}

async function megaDetailedReservationsFromClient(
  reservations: ReservationFromClient[],
  staffSupplier: Map<number, Staff>,
  serviceSupplier: Map<number, ServiceDetailed>
  // clientSupplier: Map<string, ClientDetailed>
): Promise<ReservationFromClientDetailed[]> {
  return reservations.map(
    (reservation) =>
      new ReservationFromClientDetailed(
        reservation.id,
        reservation.date,
        reservation.start,
        reservation.end,
        reservation.clientSub,
        staffSupplier.get(reservation.staff.id)!,
        serviceSupplier.get(reservation.service.id)!,
        reservation.active,
        reservation.createdAt
      )
  );
}

async function detailedBusinesses(
  businessIds: number[]
): Promise<Map<number, BusinessDetailed>> {
  const map = new Map<number, BusinessDetailed>();
  for (var businessId of businessIds)
    if (!map.get(businessId))
      map.set(businessId, await detailedBusinessById(businessId));
  return map;
}

function detailedBusiness(business: BusinessDTO): BusinessDetailed {
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

async function detailedStaffs(staffIds: number[]): Promise<Map<number, Staff>> {
  const map = new Map<number, Staff>();
  for (var staffId of staffIds)
    if (!map.get(staffId)) map.set(staffId, await staffById(staffId));
  return map;
}

async function detailedStaff(staff: StaffDTO) {
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

import axios from "axios";
import { Business } from "../domain/Business";
import { Page } from "../domain/Page";
import { Service } from "../domain/Service";

function paginationAdjustment(page: number): number {
  return page - 1;
}

export async function businessById(id: number): Promise<Business> {
  const response = await axios.get<Business>(`business/api-v1/retrieval/by-id/${id}`);
  return response.data;
}

export async function myBusinessById(id: number): Promise<Business> {
  const response = await axios.get<Business>(`business/api-v1/retrieval/my/by-id/${id}`);
  return response.data;
}

export async function businessesByOwner(
  ownerSub: string,
  page: number,
  pageSize: number
): Promise<Page<Business>> {
  const response = await axios.get<Page<Business>>(
    `business/api-v1/retrieval/by-owner/${ownerSub}/${paginationAdjustment(page)}/${pageSize}`
  );
  return response.data;
}

export async function myBusinesses(
  page: number,
  pageSize: number
): Promise<Page<Business>> {
  const response = await axios.get<Page<Business>>(
    `business/api-v1/retrieval/my/${paginationAdjustment(page)}/${pageSize}`
  );
  return response.data;
}

export async function activeBusinesses(
  page: number,
  pageSize: number
): Promise<Page<Business>> {
  const response = await axios.get<Page<Business>>(
    `business/api-v1/retrieval/active/${paginationAdjustment(page)}/${pageSize}`
  );
  return response.data;
}

export async function serviceById(id: number): Promise<Service> {
  const response = await axios.get<Service>(`services/api-v1/retrieval/by-id/${id}`);
  return response.data;
}

export async function myServiceById(id: number): Promise<Service> {
  const response = await axios.get<Service>(`services/api-v1/retrieval/my/by-id/${id}`);
  return response.data;
}

export async function activeServices(
  page: number,
  pageSize: number
): Promise<Page<Service>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/retrieval/active/${paginationAdjustment(page)}/${pageSize}`
  );
  return response.data;
}

export async function servicesByBusiness(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<Service>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/retrieval/by-business/${businessId}/${paginationAdjustment(page)}/${pageSize}`
  );
  return response.data;
}

export async function myServicesByBusiness(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<Service>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/retrieval/my/by-business/${businessId}/${paginationAdjustment(page)}/${pageSize}`
  );
  return response.data;
}

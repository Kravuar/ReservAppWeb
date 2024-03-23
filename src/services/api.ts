import axios from "axios";
import { Business } from "../domain/Business";
import { Page } from "../domain/Page";
import { Service } from "../domain/Service";

export async function businessById(id: number): Promise<Business> {
  const response = await axios.get<Business>(`business/api-v1/by-id/${id}`);
  return response.data;
}

export async function myBusinessById(id: number): Promise<Business> {
  const response = await axios.get<Business>(`business/api-v1/my/by-id/${id}`);
  return response.data;
}

export async function businessesByOwner(
  ownerSub: string,
  page: number,
  pageSize: number
): Promise<Page<Business>> {
  const response = await axios.get<Page<Business>>(
    `business/api-v1/by-owner/${ownerSub}/${page}/${pageSize}`
  );
  return response.data;
}

export async function myBusinesses(
  page: number,
  pageSize: number
): Promise<Page<Business>> {
  const response = await axios.get<Page<Business>>(
    `business/api-v1/my/${page}/${pageSize}`
  );
  return response.data;
}

export async function activeBusinesses(
  page: number,
  pageSize: number
): Promise<Page<Business>> {
  const response = await axios.get<Page<Business>>(
    `business/api-v1/active/${page}/${pageSize}`
  );
  return response.data;
}

export async function serviceById(id: number): Promise<Service> {
  const response = await axios.get<Service>(`services/api-v1/by-id/${id}`);
  return response.data;
}

export async function myServiceById(id: number): Promise<Service> {
  const response = await axios.get<Service>(`services/api-v1/my/by-id/${id}`);
  return response.data;
}

export async function activeServices(
  page: number,
  pageSize: number
): Promise<Page<Service>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/active/${page}/${pageSize}`
  );
  return response.data;
}

export async function servicesByBusiness(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<Service>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/by-business/${businessId}/${page}/${pageSize}`
  );
  return response.data;
}

export async function myServicesByBusiness(
  businessId: number,
  page: number,
  pageSize: number
): Promise<Page<Service>> {
  const response = await axios.get<Page<Service>>(
    `services/api-v1/my/by-business/${businessId}/${page}/${pageSize}`
  );
  return response.data;
}

import { BusinessDetailed } from "./Business"

export interface ServiceDetailed {
    id: number,
    business: BusinessDetailed,
    active: boolean,
    picture: string,
    rating: number,
    name: string,
    description?: string
}

export interface Service {
    id: number,
    business: ServiceBusiness,
    active: boolean,
    name: string,
    description?: string
}

interface ServiceBusiness {
    id: number,
    ownerSub: string
}
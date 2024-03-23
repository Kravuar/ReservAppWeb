export interface BusinessDetailed {
  id: number;
  name: string;
  ownerSub: string;
  active: boolean;
  description?: string;
  picture: string,
  rating: number
}

export interface Business {
  id: number;
  name: string;
  ownerSub: string;
  active: boolean;
  description?: string;
}

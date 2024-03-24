export class Staff {
  constructor(
    public id: number,
    public sub: string,
    public name: string,
    public picture: string,
    public rating: number,
    public business: StaffBusiness,
    public active: boolean
  ) {}
}

export class StaffBusiness {
  constructor(public id: number, public ownerSub: string) {}
}

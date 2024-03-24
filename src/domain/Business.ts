export class BusinessDetailed{
  constructor(
    public id: number,
    public name: string,
    public ownerSub: string,
    public active: boolean,
    public picture: string,
    public rating: number,
    public description?: string
  ) {}
}
export default class Priority {
  public id: string = ""
  public label: string = ""
	public isActive: boolean = true

  constructor(data?: Partial<Priority>) {
    Object.assign(this, data);
  }

}

export enum PriorityEnum {
	Low = "1",
	Medium = "2",
	High = "3",
}

export default class Priority {
  public id: number = 0
  public label: string = ""
	public isActive: boolean = true

  constructor(data?: Partial<Priority>) {
    Object.assign(this, data);
  }
}

import Priority from "./Priority";

export default class FeatureRequest {
  public id: number = 0;
	public title: string = ""
	public description: string = ""
	public priority: Priority = new Priority()
	public isConfirmed: boolean = false
	//date added

  constructor(data?: Partial<FeatureRequest>) {
    Object.assign(this, data);
  }
}

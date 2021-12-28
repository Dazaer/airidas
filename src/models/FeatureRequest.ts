import Priority from "./Priority";

export default class FeatureRequest {
  public id: string = "";
	public title: string = ""
	public description: string = ""
	public priorityId: string = ""
	public priorityLabel: string = ""
	public isConfirmed: boolean = false
	//date added

	/* ---------------- Navigational properties ---------------- */
	public priority: Priority = new Priority()

  constructor(data?: Partial<FeatureRequest>) {
    Object.assign(this, data);
  }

	populateNestedProperties(withPriority: boolean) {

		if (withPriority) {

			const priority = new Priority({
				id: this.priorityId,
				label: this.priorityLabel,
				isActive: true,
			})
			this.priority = priority

		}
		
		return this
	}
}

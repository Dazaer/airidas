export default class FeatureRequest {
	public id: string = "";
	public title: string = ""
	public description: string = ""
	public imageLink: string = ""

	/* ---------------- Navigational properties ---------------- */

	constructor(data?: Partial<FeatureRequest>) {
		Object.assign(this, data);
	}

	/* ---------------- Methods ---------------- */



}

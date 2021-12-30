import { DocumentData, DocumentSnapshot, FirestoreDataConverter } from "firebase/firestore";
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

	public static firestoreConverter: FirestoreDataConverter<FeatureRequest> = {
		toFirestore: (featureRequest: FeatureRequest) => {
			return {
				description: featureRequest.description,
				title: featureRequest.title,
				//priorityId: featureRequest.priority.id,
				//priorityLabel: featureRequest.priority.label,
				priority: {
					id: featureRequest.priority.id,
					label: featureRequest.priority.label,
				},
				isConfirmed: featureRequest.isConfirmed,
			};
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data();
			return new FeatureRequest(data)
		}
	}

	constructor(data?: Partial<FeatureRequest>) {
		Object.assign(this, data);
	}

	/* ---------------- Methods ---------------- */

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

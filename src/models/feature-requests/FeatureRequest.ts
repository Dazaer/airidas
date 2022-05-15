import { IBaseModel } from "@/models/BaseModel"
import { DocumentData, DocumentSnapshot, FirestoreDataConverter, UpdateData } from "firebase/firestore"
import Priority from "@/models/feature-requests/Priority"

export default class FeatureRequest implements IBaseModel {
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
		Object.assign(this, data)
	}

	/* ---------------- Firestore ---------------- */

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
			}
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data()
			return new FeatureRequest(data)
		}
	}

	public static updateToFirestore(featureRequest: FeatureRequest): UpdateData<FeatureRequest> {
		const updatedProperties: UpdateData<FeatureRequest> = {
			"title": featureRequest.title,
			"description": featureRequest.description,
			"priority": featureRequest.priority.toFirestoreFlat(),
			"isConfirmed": featureRequest.isConfirmed,
		}

		return updatedProperties
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

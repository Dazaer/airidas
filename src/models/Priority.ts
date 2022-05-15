import { FirestoreDataConverter, DocumentSnapshot, DocumentData, UpdateData } from "firebase/firestore";
import { IBaseModel } from './BaseModel';
export default class Priority implements IBaseModel {
  public id: string = ""
  public label: string = ""
	public isActive: boolean = true

  constructor(data?: Partial<Priority>) {
    Object.assign(this, data);
  }

	public static firestoreConverter: FirestoreDataConverter<Priority> = {
		toFirestore: (priority: Priority) => {
			return {
				label: priority.label,
				isActive: priority.isActive,
			};
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data() as Priority
			return new Priority(data)
		}
	}

	public static updateToFirestore(priority: Priority): UpdateData<Priority> {
		const updatedProperties: UpdateData<Priority> = {
			"label": priority.label,
		}

		return updatedProperties
	}

}

export enum PriorityEnum {
	Low = "1",
	Medium = "2",
	High = "3",
}

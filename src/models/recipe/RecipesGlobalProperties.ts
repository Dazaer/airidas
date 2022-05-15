import { IBaseModel } from "@/models/BaseModel"
import { DocumentData, DocumentSnapshot, FirestoreDataConverter, increment, UpdateData } from "firebase/firestore"

export default class RecipesGlobalProperties implements IBaseModel{
	public id: string = ""
	public recipesCount: number = 0
	public recipesAdded: number = 0

	constructor(data?: Partial<RecipesGlobalProperties>) {
		Object.assign(this, data)
	}

	/* ---------------- Firestore ---------------- */

	public static firestoreConverter: FirestoreDataConverter<RecipesGlobalProperties> = {
		toFirestore: (recipesGlobalProperties: RecipesGlobalProperties) => {
			return {
				recipesCount: recipesGlobalProperties.recipesCount,
			}
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data() as RecipesGlobalProperties
			return new RecipesGlobalProperties(data)
		}
	}

	public static updateToFirestore(model: RecipesGlobalProperties): UpdateData<RecipesGlobalProperties> {
		const updatedProperties: UpdateData<RecipesGlobalProperties> = {
			"recipesCount": increment(model.recipesAdded),
		}

		return updatedProperties
	}
}

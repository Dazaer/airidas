import { DocumentData, DocumentSnapshot, FirestoreDataConverter, increment, UpdateData } from "firebase/firestore";

export default class RecipesGlobalProperties {
	public recipesCount: number = 0

	constructor(data?: Partial<RecipesGlobalProperties>) {
		Object.assign(this, data);
	}

	/* ---------------- Firestore ---------------- */

	public static firestoreConverter: FirestoreDataConverter<RecipesGlobalProperties> = {
		toFirestore: (recipesGlobalProperties: RecipesGlobalProperties) => {
			return {
				recipesCount: recipesGlobalProperties.recipesCount,
			};
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data() as RecipesGlobalProperties
			return new RecipesGlobalProperties(data)
		}
	}

	public static updateToFirestore(value: number): UpdateData<RecipesGlobalProperties> {
		const updatedProperties: UpdateData<RecipesGlobalProperties> = {
			"recipesCount": increment(value),
		}

		return updatedProperties
	}
}

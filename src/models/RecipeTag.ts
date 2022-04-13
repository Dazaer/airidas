import { DocumentData, DocumentSnapshot, FirestoreDataConverter, UpdateData } from "firebase/firestore";

export default class RecipeTag {
	public id: string = "";
	public title: string = ""
	public description: string = ""


	constructor(data?: Partial<RecipeTag>) {
		Object.assign(this, data);
	}

	/* ---------------- Firestore ---------------- */

	public static firestoreConverter: FirestoreDataConverter<RecipeTag> = {
		toFirestore: (recipe: RecipeTag) => {
			return {
				description: recipe.description,
				title: recipe.title,
			};
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data() as RecipeTag
			return new RecipeTag(data)
		}
	}

	public static updateToFirestore(recipe: RecipeTag): UpdateData<RecipeTag> {
		const updatedProperties: UpdateData<RecipeTag> = {
			"title": recipe.title,
			"description": recipe.description,
		}

		return updatedProperties
	}

}

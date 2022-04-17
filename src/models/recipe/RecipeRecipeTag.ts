import { DocumentData, DocumentSnapshot, FirestoreDataConverter, UpdateData } from "firebase/firestore";
import RecipeTag from "../RecipeTag";

export default class RecipeRecipeTag {
	public id: string = ""
	public recipeTagId: string = ""
	public title: string = ""
	public description: string = ""


	constructor(data?: Partial<RecipeRecipeTag>) {
		Object.assign(this, data);
	}

	public toRecipeTag(): RecipeTag {
		return new RecipeTag({
			id: this.recipeTagId,
			title: this.title,
			description: this.description
		})
	}

	/* ---------------- Firestore ---------------- */

	public static firestoreConverter: FirestoreDataConverter<RecipeRecipeTag> = {
		toFirestore: (recipeRecipeTag: RecipeRecipeTag) => {
			return {
				recipeTagId: recipeRecipeTag.recipeTagId,
				title: recipeRecipeTag.title,
				description: recipeRecipeTag.description
			};
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data() as RecipeRecipeTag
			return new RecipeRecipeTag(data)
		}
	}
}

import { IBaseModel } from "@/models/BaseModel"
import RecipeRecipeTag from "@/models/recipe/RecipeRecipeTag"
import { DocumentData, DocumentSnapshot, FirestoreDataConverter, UpdateData } from "firebase/firestore"

export default class RecipeTag implements IBaseModel{
	public id: string = "";
	public title: string = ""
	public description: string = ""


	constructor(data?: Partial<RecipeTag>) {
		Object.assign(this, data)
	}

	public toRecipeRecipeTag(): RecipeRecipeTag {
		return new RecipeRecipeTag({
			recipeTagId: this.id,
			title: this.title,
			description: this.description,
		})
	}

	/* ---------------- Firestore ---------------- */

	public static firestoreConverter: FirestoreDataConverter<RecipeTag> = {
		toFirestore: (recipe: RecipeTag) => {
			return {
				description: recipe.description,
				title: recipe.title,
			}
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data() as RecipeTag
			return new RecipeTag(data)
		}
	}

	public static updateToFirestore(recipeTag: RecipeTag): UpdateData<RecipeTag> {
		const updatedProperties: UpdateData<RecipeTag> = {
			"title": recipeTag.title,
			"description": recipeTag.description,
		}

		return updatedProperties
	}

	public toFirestoreFlat() {
		return {
			id: this.id,
			title: this.title
		}
	}

}

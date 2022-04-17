import RecipeTag from '@/models/RecipeTag';
import Debugger from "@/utilities/debugger";
import dayjs from 'dayjs';
import { DocumentData, DocumentSnapshot, FirestoreDataConverter, Timestamp, UpdateData } from "firebase/firestore";

export default class Recipe {
	public id: string = "";
	public title: string = ""
	public description: string = "" //rename to notes
	public imageLink: string = "" //rename to imageUrl
	public recipeUrl: string = ""
	public tags: RecipeTag[] = []
	public insertedByUID: string = ""
	public insertedOnTimestamp: Timestamp = Timestamp.now()
	public updatedOnTimestamp: Timestamp = Timestamp.now()

	/* ---------------- ViewModel properties ---------------- */

	public insertedOnFormattedDate: string = ""
	public updatedOnFormattedDate: string = ""

	constructor(data?: Partial<Recipe>) {
		if (data == null) {
			return Object.assign(this, data);
		}

		data.insertedOnFormattedDate = data.insertedOnTimestamp ? dayjs(data.insertedOnTimestamp.toDate()).format("DD/MM/YYYY") : "No inserted date"
		data.updatedOnFormattedDate = data.updatedOnTimestamp ? dayjs(data.updatedOnTimestamp.toDate()).format("DD/MM/YYYY") : "No updated date"
		Object.assign(this, data);
	}

	/* ---------------- Firestore ---------------- */

	public static firestoreConverter: FirestoreDataConverter<Recipe> = {
		toFirestore: (recipe: Recipe) => {
			Debugger.Log(recipe.tags)
			return {
				description: recipe.description,
				title: recipe.title,
				recipeUrl: recipe.recipeUrl,
				imageLink: recipe.imageLink,
				insertedByUID: recipe.insertedByUID,
				insertedOnTimestamp: Timestamp.now(),
				updatedOnTimestamp: Timestamp.now(),
				tags: recipe.tags.map(tag => tag.toFirestoreFlat())
			};
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data() as Recipe
			return new Recipe(data)
		}
	}

	public static updateToFirestore(recipe: Recipe): UpdateData<Recipe> {
		const updatedProperties: UpdateData<Recipe> = {
			"title": recipe.title,
			"description": recipe.description,
			"recipeUrl": recipe.recipeUrl,
			"imageLink": recipe.imageLink,
			"updatedOnTimestamp": Timestamp.now(),
			"tags": recipe.tags.map(tag => tag.toFirestoreFlat())
		}

		return updatedProperties
	}

}

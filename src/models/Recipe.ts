import { DocumentData, DocumentSnapshot, FirestoreDataConverter } from "firebase/firestore";

export default class Recipe {
	public id: string = "";
	public title: string = ""
	public description: string = ""
	public imageLink: string = ""

	/* ---------------- Navigational properties ---------------- */

	constructor(data?: Partial<Recipe>) {
		Object.assign(this, data);
	}

	/* ---------------- Firestore ---------------- */

	public static firestoreConverter: FirestoreDataConverter<Recipe> = {
		toFirestore: (recipe: Recipe) => {
			return {
				description: recipe.description,
				title: recipe.title,
				imageLink: recipe.imageLink,
			};
		},
		fromFirestore: (snapshot: DocumentSnapshot<DocumentData>) => {
			const data = snapshot.data();
			return new Recipe(data)
		}
	}


	/* ---------------- Methods ---------------- */



}

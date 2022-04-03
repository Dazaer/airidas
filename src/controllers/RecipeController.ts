import Recipe from "@/models/Recipe";
import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore"

export default class RecipeController {

	private readonly db = getFirestore();
	private readonly COLLECTION_PATH = 'recipes'


	async get(id: string): Promise<Recipe> {

		const docRef = doc(this.db, this.COLLECTION_PATH, id);
		const documentSnapshot = await getDoc(docRef)

		let model = documentSnapshotToModel<Recipe>(Recipe, documentSnapshot, "id")

		if (model == null) {
			model = new Recipe()
		}

		return model
	}

	async getAll(): Promise<Recipe[]> {

		const collectionRef = collection(this.db, this.COLLECTION_PATH)
		const querySnapshot = await getDocs(collectionRef)

		const models = querySnapshotToModelArray<Recipe>(Recipe, querySnapshot, "id")

		models.map(model => {
			return model;
		})

		return models
	}

	async add(featureRequest: Recipe): Promise<any> {
		console.log(featureRequest)
		const collectionRef = collection(this.db, this.COLLECTION_PATH).withConverter(Recipe.firestoreConverter);
		return addDoc(collectionRef, featureRequest);
	}

	async update(featureRequest: Recipe): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, featureRequest.id).withConverter(Recipe.firestoreConverter);
		return setDoc(docRef, featureRequest);
	}

	async delete(featureRequestId: string): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, featureRequestId);
		return deleteDoc(docRef);
	}

}

import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, QueryConstraint, updateDoc } from "firebase/firestore"
import RecipeTag from "@/models/RecipeTag";

export default class RecipeTagController {

	private readonly db = getFirestore();
	private readonly COLLECTION_PATH = 'recipe-tags'

	async get(id: string): Promise<RecipeTag> {
		const docRef = doc(this.db, this.COLLECTION_PATH, id).withConverter(RecipeTag.firestoreConverter);
		const documentSnapshot = await getDoc(docRef)
		let model = documentSnapshotToModel<RecipeTag>(RecipeTag, documentSnapshot, "id")

		if (model == null) {
			model = new RecipeTag()
		}

		return model
	}

	async getAll(): Promise<RecipeTag[]> {
		const collectionRef = collection(this.db, this.COLLECTION_PATH).withConverter(RecipeTag.firestoreConverter)
		const queryConstraints: QueryConstraint[] = []

		const dbQuery = query(collectionRef, ...queryConstraints)
		const querySnapshot = await getDocs(dbQuery)

		const models = querySnapshotToModelArray<RecipeTag>(RecipeTag, querySnapshot, "id")

		models.map(model => {
			return model;
		})

		return models
	}

	async add(recipeTag: RecipeTag): Promise<any> {
		const collectionRef = collection(this.db, this.COLLECTION_PATH).withConverter(RecipeTag.firestoreConverter);
		return addDoc(collectionRef, recipeTag);
	}

	async update(recipeTag: RecipeTag): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, recipeTag.id).withConverter(RecipeTag.firestoreConverter);
		return updateDoc(docRef, RecipeTag.updateToFirestore(recipeTag))
	}

	async delete(recipeTagId: string): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, recipeTagId);
		return deleteDoc(docRef);
	}

}


import Recipe from "@/models/Recipe";
import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, OrderByDirection, query, QueryConstraint, updateDoc } from "firebase/firestore"
import { addDefaultValueForFieldInCollection, CollectionFieldUpdateModel } from "@/utilities/firebase/firestoreFunctions";

export default class RecipeController {

	private readonly db = getFirestore();
	private readonly COLLECTION_PATH = 'recipes'

	private _orderByField: OrderByField | null = null


	public orderBy<K extends keyof Recipe>(field: K, directionStr?: OrderByDirection): RecipeController {
		this._orderByField = new OrderByField({field: field})
		this._orderByField.directionStr = directionStr ?? this._orderByField.directionStr
		return this;
	}

	async get(id: string): Promise<Recipe> {
		const docRef = doc(this.db, this.COLLECTION_PATH, id).withConverter(Recipe.firestoreConverter);
		const documentSnapshot = await getDoc(docRef)
		let model = documentSnapshotToModel<Recipe>(Recipe, documentSnapshot, "id")

		if (model == null) {
			model = new Recipe()
		}

		return model
	}

	async getAll(): Promise<Recipe[]> {
		const collectionRef = collection(this.db, this.COLLECTION_PATH).withConverter(Recipe.firestoreConverter)

		const queryConstraints: QueryConstraint[] = []
		if (this._orderByField != null) {
			queryConstraints.push(orderBy(this._orderByField.field, this._orderByField.directionStr))
		}

		const dbQuery = query(collectionRef, ...queryConstraints)
		const querySnapshot = await getDocs(dbQuery)

		const models = querySnapshotToModelArray<Recipe>(Recipe, querySnapshot, "id")

		models.map(model => {
			return model;
		})

		return models
	}

	async add(recipe: Recipe): Promise<any> {
		console.log(recipe)
		const collectionRef = collection(this.db, this.COLLECTION_PATH).withConverter(Recipe.firestoreConverter);
		return addDoc(collectionRef, recipe);
	}

	async update(recipe: Recipe): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, recipe.id).withConverter(Recipe.firestoreConverter);
		return updateDoc(docRef, Recipe.updateToFirestore(recipe))
	}

	async delete(recipeId: string): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, recipeId);
		return deleteDoc(docRef);
	}

	updateField<K extends keyof Recipe>(field: K, value: Recipe[typeof field]) {
		const collectionRef = collection(this.db, this.COLLECTION_PATH).withConverter(Recipe.firestoreConverter);
		const updateFieldModel = new CollectionFieldUpdateModel(collectionRef, field, value)
		addDefaultValueForFieldInCollection(updateFieldModel)
	}

}

class OrderByField {
	public field!: keyof Recipe
	public directionStr?: OrderByDirection = "asc"

	constructor(data?: Partial<OrderByField>) {
		Object.assign(this, data);
	}
}


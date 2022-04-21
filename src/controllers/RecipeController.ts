import RecipeTag from '@/models/RecipeTag';
import Recipe from "@/models/Recipe";
import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { addDoc, collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, OrderByDirection, query, QueryConstraint, updateDoc, where } from "firebase/firestore"
import { addDefaultValueForFieldInCollection, CollectionFieldUpdateModel } from "@/utilities/firebase/firestoreFunctions";
import RecipeRecipeTagController from "./RecipeRecipeTagController";
import RecipeRecipeTag from "@/models/recipe/RecipeRecipeTag";
import Debugger from "@/utilities/debugger";

export default class RecipeController {

	private readonly db = getFirestore();
	public static readonly COLLECTION_PATH = 'recipes'

	private _orderByField: OrderByField | null = null
	private _filterByField: FilterByField | null = null


	public orderBy<K extends keyof Recipe>(field: K, directionStr?: OrderByDirection): RecipeController {
		this._orderByField = new OrderByField({ field: field })
		this._orderByField.directionStr = directionStr ?? this._orderByField.directionStr
		return this;
	}

	public filterBy<K extends keyof Recipe>(field: K, value: Recipe[typeof field]): RecipeController {
		this._filterByField = new FilterByField({ field: field, value: value })
		return this
	}

	async get(id: string): Promise<Recipe> {
		const docRef = doc(this.db, RecipeController.COLLECTION_PATH, id).withConverter(Recipe.firestoreConverter);
		const documentSnapshot = await getDoc(docRef)

		let model = documentSnapshotToModel<Recipe>(Recipe, documentSnapshot, "id")
		if (model == null) {
			model = new Recipe()
		}

		const recipeRecipeTagController = new RecipeRecipeTagController(id);
		const recipeRecipeTags: RecipeRecipeTag[] = await recipeRecipeTagController.getAll();
		model.tags = recipeRecipeTags.map(recipeRecipeTag => recipeRecipeTag.toRecipeTag());

		return model
	}

	async getAll(): Promise<Recipe[]> {
		const collectionRef = collection(this.db, RecipeController.COLLECTION_PATH).withConverter(Recipe.firestoreConverter)
		Debugger.Warn(this._filterByField)

		const queryConstraints: QueryConstraint[] = []
		if (this._orderByField != null) {
			queryConstraints.push(orderBy(this._orderByField.field, this._orderByField.directionStr))
		}

		if (this._filterByField != null) {
			if (this._filterByField.field === "tags") {
				/* This is a (worse?) different way to get all the recipeTags of a certain id
				const filterField: keyof RecipeRecipeTag = "recipeTagId"
				const filterValue = (this._filterByField.value as RecipeTag).id
				const rrtCollectionRef = collectionGroup(this.db, RecipeRecipeTagController.COLLECTION_PATH).withConverter(RecipeRecipeTag.firestoreConverter)
				const groupConstraints: QueryConstraint[] = []

				groupConstraints.push(where(filterField, "==", filterValue))
				const rrtQuery = query(rrtCollectionRef, ...groupConstraints)
				const rrtSnapshot = await getDocs(rrtQuery)
				const models = querySnapshotToModelArray<RecipeRecipeTag>(RecipeRecipeTag, rrtSnapshot, "id")

				Debugger.Log(models)
				*/
			}
		}

		const dbQuery = query(collectionRef, ...queryConstraints)
		const querySnapshot = await getDocs(dbQuery)

		let models = querySnapshotToModelArray<Recipe>(Recipe, querySnapshot, "id")

		if (this._filterByField != null) {
			if (this._filterByField.field === "tags") {
				const recipeTagFilter: RecipeTag = this._filterByField.value[0]
				models = models.filter(model => model.tags.some(tag => tag.id === recipeTagFilter.id))
			}
		}

		return models
	}

	getDefaultImageUrl(): string {
		return "https://i.imgur.com/umqiCCU.png"
	}

	async add(recipe: Recipe): Promise<any> {
		const collectionRef = collection(this.db, RecipeController.COLLECTION_PATH).withConverter(Recipe.firestoreConverter);

		const addedDoc = await addDoc(collectionRef, recipe);
		const recipeRecipeTagController = new RecipeRecipeTagController(addedDoc.id);

		const promises: Promise<any>[] = []
		recipe.tags.forEach(tag => {
			promises.push(recipeRecipeTagController.add(tag.toRecipeRecipeTag()))
		})

		return Promise.all(promises)
	}

	async update(recipe: Recipe): Promise<any> {
		const docRef = doc(this.db, RecipeController.COLLECTION_PATH, recipe.id).withConverter(Recipe.firestoreConverter);
		const recipeRecipeTagController = new RecipeRecipeTagController(recipe.id);

		const existingRecipeRecipeTags = await recipeRecipeTagController.getAll()
		const deletedTags = existingRecipeRecipeTags.filter(errt => recipe.tags.every(tag => errt.recipeTagId !== tag.id))
		const newTags = recipe.tags.filter(tag => existingRecipeRecipeTags.every(errt => errt.recipeTagId !== tag.id))

		const promises: Promise<any>[] = []
		newTags.forEach(tag => {
			promises.push(recipeRecipeTagController.add(tag.toRecipeRecipeTag()))
		})
		deletedTags.forEach(tag => {
			promises.push(recipeRecipeTagController.delete(tag.id))
		})

		await Promise.all(promises)
		return updateDoc(docRef, Recipe.updateToFirestore(recipe))
	}

	async delete(recipeId: string): Promise<any> {
		const docRef = doc(this.db, RecipeController.COLLECTION_PATH, recipeId).withConverter(Recipe.firestoreConverter);
		const recipeRecipeTagController = new RecipeRecipeTagController(recipeId);

		recipeRecipeTagController.deleteAll()
		return deleteDoc(docRef);
	}

	updateField<K extends keyof Recipe>(field: K, value: Recipe[typeof field]) {
		const collectionRef = collection(this.db, RecipeController.COLLECTION_PATH).withConverter(Recipe.firestoreConverter);
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

class FilterByField {
	public field!: keyof Recipe
	public value: any = null

	constructor(data?: Partial<FilterByField>) {
		Object.assign(this, data);
	}
}


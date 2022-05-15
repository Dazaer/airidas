import RecipeTag from '@/models/recipe/RecipeTag';
import Recipe from "@/models/recipe/Recipe";
import { collection, doc, endBefore, getDoc, limit, limitToLast, orderBy, OrderByDirection, QueryConstraint, startAfter, updateDoc, where } from "firebase/firestore"
import { addDefaultValueForFieldInCollection, CollectionFieldUpdateModel } from "@/utilities/firebase/firestoreFunctions";
import RecipeRecipeTagController from "@/controllers/recipes/RecipeRecipeTagController";
import RecipeRecipeTag from "@/models/recipe/RecipeRecipeTag";
import RecipeTagController from "@/controllers/recipes/RecipeTagController";
import RecipesGlobalPropertiesController from "@/controllers/recipes/RecipesGlobalPropertiesController";
import Debugger from "@/utilities/debugger";
import BaseController from "@/controllers/BaseController";

export default class RecipeController extends BaseController<Recipe>{

	public static readonly COLLECTION_PATH = 'recipes'
	private readonly recipeTagController = new RecipeTagController();
	private readonly recipesGlobalPropertiesController = new RecipesGlobalPropertiesController();
	private _orderByField: OrderByField = new OrderByField()
	private _filterByField: FilterByField = new FilterByField()
	private _limitTo: LimitTo = new LimitTo()
	private _startAfter: StartAfter = new StartAfter()
	private _endBefore: EndBefore = new EndBefore()

	constructor() {
		super(Recipe, RecipeController.COLLECTION_PATH)
	}


	public orderBy<K extends keyof Recipe>(field: K, directionStr?: OrderByDirection): RecipeController {
		this._orderByField.field = field
		this._orderByField.directionStr = directionStr ?? this._orderByField.directionStr
		this._filterByField.isActive = true
		return this;
	}

	public filterBy<K extends keyof Recipe>(field: K, value: Recipe[typeof field]): RecipeController {
		this._filterByField.field = field
		this._filterByField.value = value
		this._filterByField.isActive = true
		return this
	}

	public limitTo(value?: number): RecipeController {
		this._limitTo.value = value ?? this._limitTo.value
		this._limitTo.isActive = true
		return this
	}

	public startAfter(lastDocumentId?: string): RecipeController {
		this._startAfter.lastDocumentId = lastDocumentId ?? this._startAfter.lastDocumentId
		this._startAfter.isActive = true
		this._endBefore.isActive = false
		return this
	}

	public endBefore(lastDocumentId?: string): RecipeController {
		this._endBefore.lastDocumentId = lastDocumentId ?? this._endBefore.lastDocumentId
		this._endBefore.isActive = true
		this._startAfter.isActive = false
		return this
	}

	async get(id: string): Promise<Recipe> {
		const model = await super.get(id)

		const recipeRecipeTagController = new RecipeRecipeTagController(id);
		const recipeRecipeTags: RecipeRecipeTag[] = await recipeRecipeTagController.getAll();
		model.tags = recipeRecipeTags.map(recipeRecipeTag => recipeRecipeTag.toRecipeTag());

		return model
	}

	async getAll(): Promise<Recipe[]> {
		const queryConstraints: QueryConstraint[] = await this.getQueryConstraints()
		const models = super.getAll(queryConstraints)
		return models
	}

	getDefaultImageUrl(): string {
		return "https://i.imgur.com/umqiCCU.png"
	}

	getRecipesPerPageCount(): number {
		return this._limitTo.value
	}

	async getTotalRecipesCount(): Promise<number> {
		return (await this.recipesGlobalPropertiesController.get()).recipesCount
	}

	async add(recipe: Recipe): Promise<any> {
		const addedDoc = await super.add(recipe)
		await this.recipesGlobalPropertiesController.incrementRecipesCount(1)

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
		const recipeRecipeTagController = new RecipeRecipeTagController(recipeId);
		recipeRecipeTagController.deleteAll()

		await super.delete(recipeId);
		return this.recipesGlobalPropertiesController.incrementRecipesCount(-1)
	}

	updateField<K extends keyof Recipe>(field: K, value: Recipe[typeof field]) {
		const collectionRef = collection(this.db, RecipeController.COLLECTION_PATH).withConverter(Recipe.firestoreConverter);
		const updateFieldModel = new CollectionFieldUpdateModel(collectionRef, field, value)
		addDefaultValueForFieldInCollection(updateFieldModel)
	}


	private async getQueryConstraints(): Promise<QueryConstraint[]> {
		const queryConstraints: QueryConstraint[] = []

		if (this._orderByField.isActive) {
			queryConstraints.push(orderBy(this._orderByField.field, this._orderByField.directionStr))
		}

		if (this._filterByField != null) {
			if (this._filterByField.field === "tags") {
				const filterValue: string = (this._filterByField.value as RecipeTag[])[0].id //currently only allowing to filter by a single tag
				const flatRecipeTagObj = (await this.recipeTagController.get(filterValue)).toFirestoreFlat()

				queryConstraints.push(where(this._filterByField.field, "array-contains", flatRecipeTagObj))
			}
		}

		if (this._limitTo.isActive) {
			const limitConstraint = this._endBefore.isActive ? limitToLast(this._limitTo.value) : limit(this._limitTo.value)
			queryConstraints.push(limitConstraint)
		}

		if (this._startAfter.isActive) {
			const lastDocRef = doc(this.db, RecipeController.COLLECTION_PATH, this._startAfter.lastDocumentId).withConverter(Recipe.firestoreConverter);
			const documentSnapshot = await getDoc(lastDocRef)

			queryConstraints.push(startAfter(documentSnapshot))
		}

		if (this._endBefore.isActive) {
			const lastDocRef = doc(this.db, RecipeController.COLLECTION_PATH, this._endBefore.lastDocumentId).withConverter(Recipe.firestoreConverter);
			const documentSnapshot = await getDoc(lastDocRef)

			queryConstraints.push(endBefore(documentSnapshot))
		}

		return queryConstraints
	}

}

class OrderByField {
	public field: keyof Recipe = "updatedOnTimestamp"
	public directionStr?: OrderByDirection = "asc"
	public isActive: boolean = true

	constructor(data?: Partial<OrderByField>) {
		Object.assign(this, data);
	}
}

class FilterByField {
	public field!: keyof Recipe
	public value: any = null
	public isActive: boolean = false

	constructor(data?: Partial<FilterByField>) {
		Object.assign(this, data);
	}
}

class LimitTo {
	public value: number = 9
	public isActive: boolean = false

	constructor(data?: Partial<LimitTo>) {
		Object.assign(this, data);
	}
}

class StartAfter {
	public lastDocumentId: string = ""
	public isActive: boolean = false

	constructor(data?: Partial<StartAfter>) {
		Object.assign(this, data);
	}
}

class EndBefore {
	public lastDocumentId: string = ""
	public isActive: boolean = false

	constructor(data?: Partial<EndBefore>) {
		Object.assign(this, data);
	}
}


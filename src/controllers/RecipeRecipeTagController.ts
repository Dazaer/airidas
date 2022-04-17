import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, orderBy, Query, query, QueryConstraint, updateDoc } from "firebase/firestore"
import RecipeRecipeTag from "@/models/recipe/RecipeRecipeTag";
import RecipeController from "./RecipeController";
import { deleteQueryBatch } from "@/utilities/firebase/firestoreFunctions";

/**
 * Yes, this should not actually exist as we do not need a collection for simple RecipeTags. We could hold them in an array of a Recipe as we're currently doing.
 * However, this is meant for practice and testing.
 */
export default class RecipeRecipeTagController {

	private readonly db = getFirestore();
	public static readonly COLLECTION_PATH = 'recipe-recipe-tags'
	private readonly modelIdentifierName = "id"
	private recipeId: string = ""
	
	public get collectionPath() : string {
		return `${RecipeController.COLLECTION_PATH}/${this.recipeId}/${RecipeRecipeTagController.COLLECTION_PATH}`
	}

	constructor(recipeId: string) {
		this.recipeId = recipeId;
	}

	async get(id: string): Promise<RecipeRecipeTag> {
		const docRef = doc(this.db, this.collectionPath, id).withConverter(RecipeRecipeTag.firestoreConverter);
		const documentSnapshot = await getDoc(docRef)
		let model = documentSnapshotToModel<RecipeRecipeTag>(RecipeRecipeTag, documentSnapshot, "id")

		if (model == null) {
			model = new RecipeRecipeTag()
		}

		return model
	}

	async getAll(): Promise<RecipeRecipeTag[]> {
		const collectionRef = collection(this.db, this.collectionPath).withConverter(RecipeRecipeTag.firestoreConverter)
		const queryConstraints: QueryConstraint[] = []

		const dbQuery = query(collectionRef, ...queryConstraints)
		const querySnapshot = await getDocs(dbQuery)

		const models = querySnapshotToModelArray<RecipeRecipeTag>(RecipeRecipeTag, querySnapshot, this.modelIdentifierName)

		models.map(model => {
			return model;
		})

		return models
	}

	async add(recipeTag: RecipeRecipeTag): Promise<any> {
		const collectionRef = collection(this.db, this.collectionPath).withConverter(RecipeRecipeTag.firestoreConverter);
		return addDoc(collectionRef, recipeTag);
	}

	async delete(recipeTagId: string): Promise<any> {
		const docRef = doc(this.db, this.collectionPath, recipeTagId);
		return deleteDoc(docRef);
	}

	async deleteAll() {
		const batchSize:number = 50
		const collectionRef = collection(this.db, this.collectionPath);
		const queryConstraints: QueryConstraint[] = [limit(batchSize)]
		const dbQuery = query(collectionRef, ...queryConstraints)
	
		return new Promise((resolve, reject) => {
			deleteQueryBatch(this.db, dbQuery, resolve).catch(reject);
		});
	}

}


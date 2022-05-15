import { collection, limit, query, QueryConstraint } from "firebase/firestore"
import RecipeRecipeTag from "@/models/recipe/RecipeRecipeTag"
import RecipeController from "@/controllers/recipes/RecipeController"
import { deleteQueryBatch } from "@/utilities/firebase/firestoreFunctions"
import BaseController from "@/controllers/BaseController"

/**
 * Yes, this should not actually exist as we do not need a collection for simple RecipeTags. We could hold them in an array of a Recipe as we're currently doing.
 * However, this is meant for practice and testing.
 */
export default class RecipeRecipeTagController extends BaseController<RecipeRecipeTag>{

	public static readonly COLLECTION_PATH = "recipe-recipe-tags"

	constructor(recipeId: string) {
		const fullCollectionPath = `${RecipeController.COLLECTION_PATH}/${recipeId}/${RecipeRecipeTagController.COLLECTION_PATH}`
		super(RecipeRecipeTag, fullCollectionPath)
	}

	async deleteAll() {
		const batchSize:number = 50
		const collectionRef = collection(this.db, this.collectionPath)
		const queryConstraints: QueryConstraint[] = [limit(batchSize)]
		const dbQuery = query(collectionRef, ...queryConstraints)
	
		return new Promise((resolve, reject) => {
			deleteQueryBatch(this.db, dbQuery, resolve).catch(reject)
		})
	}

}

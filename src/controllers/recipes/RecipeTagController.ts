import RecipeTag from "@/models/recipe/RecipeTag";
import BaseController from "@/controllers/BaseController";

export default class RecipeTagController extends BaseController<RecipeTag> {

	static readonly COLLECTION_PATH = 'recipe-tags'
	
	constructor() {
		super(RecipeTag, RecipeTagController.COLLECTION_PATH)
	}

}


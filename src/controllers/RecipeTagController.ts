import RecipeTag from "@/models/RecipeTag";
import BaseController from "./BaseController";

export default class RecipeTagController extends BaseController<RecipeTag> {

	static readonly COLLECTION_PATH = 'recipe-tags'
	
	constructor() {
		super(RecipeTag, RecipeTagController.COLLECTION_PATH)
	}

}


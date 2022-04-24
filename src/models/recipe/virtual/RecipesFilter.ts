import RecipeTag from "@/models/RecipeTag";

export class RecipesFilter {
	public tag: RecipeTag = new RecipeTag();

	constructor(data?: Partial<RecipesFilter>) {
		return Object.assign(this, data);
	}
}
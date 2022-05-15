import RecipeTag from "@/models/recipe/RecipeTag";

export class RecipesFilter {
	public tag: RecipeTag = new RecipeTag();

	constructor(data?: Partial<RecipesFilter>) {
		return Object.assign(this, data);
	}
}
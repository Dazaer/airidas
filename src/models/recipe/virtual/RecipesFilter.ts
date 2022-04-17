import RecipeTag from "@/models/RecipeTag";

export class RecipesFilter {
	public tag: RecipeTag | null = null;

	constructor(data?: Partial<RecipesFilter>) {
		return Object.assign(this, data);
	}
}
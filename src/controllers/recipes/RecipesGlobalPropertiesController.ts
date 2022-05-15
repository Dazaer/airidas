import RecipesGlobalProperties from '@/models/recipe/RecipesGlobalProperties';
import { doc, updateDoc } from "firebase/firestore"
import BaseController from "../BaseController";
import GlobalPropertiesController from "../GlobalPropertiesController";

export default class RecipesGlobalPropertiesController extends BaseController<RecipesGlobalProperties>{

	private readonly DOCUMENT_ID = "recipes-properties"

	constructor() {
		super(RecipesGlobalProperties, GlobalPropertiesController.COLLECTION_PATH)
	}

	async get(): Promise<RecipesGlobalProperties> {
		return super.get(this.DOCUMENT_ID)
	}

	async incrementRecipesCount(value: number) {
		const docRef = doc(this.db, GlobalPropertiesController.COLLECTION_PATH, this.DOCUMENT_ID).withConverter(RecipesGlobalProperties.firestoreConverter);

		const recipeGlobalProperties = new RecipesGlobalProperties()
		recipeGlobalProperties.recipesAdded = value;

		return updateDoc(docRef, RecipesGlobalProperties.updateToFirestore(recipeGlobalProperties))
	}
}

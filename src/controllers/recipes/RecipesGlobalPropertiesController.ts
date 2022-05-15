import RecipesGlobalProperties from '@/models/recipe/RecipesGlobalProperties';
import { documentSnapshotToModel } from "@/utilities/firebase/firestoreModelConverter";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"
import GlobalPropertiesController from "../GlobalPropertiesController";

export default class RecipesGlobalPropertiesController extends GlobalPropertiesController {

	private readonly db = getFirestore();
	private readonly DOCUMENT_ID = "recipes-properties"

	async get(): Promise<RecipesGlobalProperties> {
		const docRef = doc(this.db, GlobalPropertiesController.COLLECTION_PATH, this.DOCUMENT_ID).withConverter(RecipesGlobalProperties.firestoreConverter);
		const documentSnapshot = await getDoc(docRef)
		let model = documentSnapshotToModel<RecipesGlobalProperties>(RecipesGlobalProperties, documentSnapshot)

		if (model == null) {
			model = new RecipesGlobalProperties()
		}

		return model
	}

	async incrementRecipesCount(value: number) {
		const docRef = doc(this.db, GlobalPropertiesController.COLLECTION_PATH, this.DOCUMENT_ID).withConverter(RecipesGlobalProperties.firestoreConverter);

		return updateDoc(docRef, RecipesGlobalProperties.updateToFirestore(value))
	}
}

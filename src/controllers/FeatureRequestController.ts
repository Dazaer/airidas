import FeatureRequest from "@/models/FeatureRequest";
import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore"
import PriorityController from "./PriorityController";

export default class FeatureRequestController {
	
	private readonly COLLECTION_PATH = 'feature-requests'
	private readonly db = getFirestore();

	private _withPriority = false

	constructor(data?: Partial<FeatureRequestController>) {
		//Object.assign(this, data);
	}

	includePriority(): FeatureRequestController {
		this._withPriority = true
		return this
	}

	async getAll(): Promise<FeatureRequest[]> {
	
		const querySnapshot = await getDocs(collection(this.db, this.COLLECTION_PATH))
		const models = querySnapshotToModelArray<FeatureRequest>(FeatureRequest, querySnapshot, "id")

		models.map(model => {
			if (this._withPriority) {
				//model.priority = await new PriorityController().get(model.priorityId)
				model = model.populateNestedProperties(this._withPriority)
			}

			return model;
		})

		return models
	}

	async get(id: string): Promise<FeatureRequest> {
	
		const docRef = doc(this.db, this.COLLECTION_PATH, id);
		const documentSnapshot = await getDoc(docRef)

		let model = documentSnapshotToModel<FeatureRequest>(FeatureRequest, documentSnapshot, "id")

		if (model == null) {
			model = new FeatureRequest()
		}
		
		if (this._withPriority) {
			//model.priority = await new PriorityController().get(model.priorityId)
			model.populateNestedProperties(this._withPriority)
		}

		return model
	}


}


import FeatureRequest from "@/models/FeatureRequest";
import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, Unsubscribe, where } from "firebase/firestore"
import PriorityController from "./PriorityController";

export default class FeatureRequestController {

	private readonly db = getFirestore();
	private readonly COLLECTION_PATH = 'feature-requests'

	private _withPriority = false

	constructor(data?: Partial<FeatureRequestController>) {
		//Object.assign(this, data);
	}

	includePriority(): FeatureRequestController {
		this._withPriority = true
		return this
	}

	async getAll(): Promise<FeatureRequest[]> {

		const collectionRef = collection(this.db, this.COLLECTION_PATH)
		const querySnapshot = await getDocs(collectionRef)

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

	/**
	 * DO NOT USE. Currently not working as intended.
	 * @returns 
	 */
	async getAllSubscribed(): Promise<FeatureRequest[]> {

		const collectionRef = collection(this.db, this.COLLECTION_PATH)

		let models: FeatureRequest[] = []

		const unsub = onSnapshot(collectionRef,
			(querySnapshot) => {
				const newModels = querySnapshotToModelArray<FeatureRequest>(FeatureRequest, querySnapshot, "id")

				console.log("Current features: ", newModels.map(f => f.title).join(", "));


				newModels.map(model => {
					if (this._withPriority) {
						//model.priority = await new PriorityController().get(model.priorityId)
						model = model.populateNestedProperties(this._withPriority)
					}

					return model;
				})

				return models = newModels
			},
			(error) => {
				console.error("Error: ", error);
				return error
			});

		console.log("returning models ", models)
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

	async add(featureRequest: FeatureRequest): Promise<any> {
		console.log(featureRequest)
		const collectionRef = collection(this.db, this.COLLECTION_PATH).withConverter(FeatureRequest.firestoreConverter);
		return addDoc(collectionRef, featureRequest);
	}

	async update(featureRequest: FeatureRequest): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, featureRequest.id).withConverter(FeatureRequest.firestoreConverter);
		return setDoc(docRef, featureRequest);
	}

	async delete(featureRequestId: string): Promise<any> {
		const docRef = doc(this.db, this.COLLECTION_PATH, featureRequestId);
		return deleteDoc(docRef);
	}

}


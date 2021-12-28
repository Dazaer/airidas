import Priority from "@/models/Priority";
import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore"

export default class PriorityController {
	
	private readonly COLLECTION_PATH = 'priorities'
	private readonly db = getFirestore();

	constructor(data?: Partial<PriorityController>) {
		Object.assign(this, data);
  }
	
	async getAll(): Promise<Priority[]> {
		const db = getFirestore();
	
		const querySnapshot = await getDocs(collection(db, this.COLLECTION_PATH))
		const priorities = querySnapshotToModelArray<Priority>(Priority, querySnapshot, "id")
		//const priorities = await firestoreConverter.priorities
		return priorities
	}

	async get(id: string): Promise<Priority> {
		const docRef = doc(this.db, this.COLLECTION_PATH, id);
		const documentSnapshot = await getDoc(docRef)

		let model = documentSnapshotToModel<Priority>(Priority, documentSnapshot, "id")

		if (model == null) {
			model = new Priority()
		}

		return model
	}
}


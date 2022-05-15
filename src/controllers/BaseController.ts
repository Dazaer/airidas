import { IBaseModel, IBaseModelBuilder } from './../models/BaseModel';
import { documentSnapshotToModel, querySnapshotToModelArray } from "@/utilities/firebase/firestoreModelConverter";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, QueryConstraint, updateDoc } from "firebase/firestore"

export default class BaseController<T extends IBaseModel> {

	readonly db = getFirestore();
	readonly collectionPath: string
	private Model: IBaseModelBuilder<T>;

	constructor(model: IBaseModelBuilder<T>, collectionPath: string) {
		this.collectionPath = collectionPath
		this.Model = model;
}

	async get(id: string): Promise<T> {
		const docRef = doc(this.db, this.collectionPath, id).withConverter(this.Model.firestoreConverter);
		const documentSnapshot = await getDoc(docRef)
		let model = documentSnapshotToModel<T>(this.Model, documentSnapshot, "id")

		if (model == null) {
			model = new this.Model()
		}

		return model
	}

	async getAll(): Promise<T[]> {
		const collectionRef = collection(this.db, this.collectionPath).withConverter(this.Model.firestoreConverter)
		const queryConstraints: QueryConstraint[] = []

		const dbQuery = query(collectionRef, ...queryConstraints)
		const querySnapshot = await getDocs(dbQuery)

		const models = querySnapshotToModelArray<T>(this.Model, querySnapshot, "id")

		models.map(model => {
			return model;
		})

		return models
	}

	async add(model: T): Promise<any> {
		const collectionRef = collection(this.db, this.collectionPath).withConverter(this.Model.firestoreConverter);
		return addDoc(collectionRef, model);
	}

	async update(model: T): Promise<any> {
		const docRef = doc(this.db, this.collectionPath, model.id).withConverter(this.Model.firestoreConverter);
		return updateDoc(docRef, this.Model.updateToFirestore(model))
	}

	async delete(modelId: string): Promise<any> {
		const docRef = doc(this.db, this.collectionPath, modelId);
		return deleteDoc(docRef);
	}

}
import { FirestoreDataConverter, UpdateData } from "firebase/firestore";

export interface IBaseModel {
	id: string;
}

export interface IBaseModelBuilder<T extends IBaseModel> {
	new(): T;
	firestoreConverter: FirestoreDataConverter<T>;
	updateToFirestore(model: T): UpdateData<T>;
}

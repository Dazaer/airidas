import { DocumentData, DocumentSnapshot, onSnapshot, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";



export function querySnapshotToModelArray<T>(Tconstructor: new (...args: any[]) => T, snapshot: QuerySnapshot<DocumentData>, modelIdentifierName: string) {
	const returnArr: T[] = [];

	snapshot.forEach(function (doc: QueryDocumentSnapshot<DocumentData>) {
		const item: T = new Tconstructor(doc.data())
		
		Object.defineProperty(item, modelIdentifierName, {writable: true, value: doc.id})
		//item[modelIdentifierName] = doc.id;

		returnArr.push(item as T);
	});

	return returnArr;
}

export function documentSnapshotToModel<T>(Tconstructor: new (...args: any[]) => T, snapshot: DocumentSnapshot<DocumentData>, modelIdentifierName: string) {


	/*
*/
	const item: T = new Tconstructor(snapshot.data())

	if (item == null) {
		console.error(`There is no ${typeof new Tconstructor()} in firebase store.`)
		return null;
	}

	Object.defineProperty(item, modelIdentifierName, {writable: true, value: snapshot.id})
	//item[modelIdentifierName] = snapshot.id

	return item as T;
}
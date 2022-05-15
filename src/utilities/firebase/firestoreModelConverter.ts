import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore"


/**
 * Used for transforming a collection that is gotten from firebase database into a corresponding typescript model array.
 * @param Tconstructor The class of the model that will be used as T
 * @param snapshot Firebase QuerySnapshot from getDocs function
 * @param modelIdentifierName The model's unique identifier name. For example 'id' or 'key'. Whatever T uses.
 * @returns 
 */
export function querySnapshotToModelArray<T>(Tconstructor: new (...args: any[]) => T, snapshot: QuerySnapshot<DocumentData>, modelIdentifierName: string) {
	const returnArr: T[] = []

	snapshot.forEach(function (doc: QueryDocumentSnapshot<DocumentData>) {
		const item: T = new Tconstructor(doc.data())
		
		Object.defineProperty(item, modelIdentifierName, {writable: true, value: doc.id})

		returnArr.push(item as T)
	})

	return returnArr
}

/**
 * Used for transforming a document that is gotten from firebase database into a corresponding typescript model.
 * @param Tconstructor The class of the model that will be used as T
 * @param snapshot Firebase DocumentSnapshot from getDocs function
 * @param modelIdentifierName (Optional) The model's unique identifier name. For example 'id' or 'key'. Whatever T uses.
 * @returns 
 */
export function documentSnapshotToModel<T>(Tconstructor: new (...args: any[]) => T, snapshot: DocumentSnapshot<DocumentData>, modelIdentifierName?: string) {
	const item: T = new Tconstructor(snapshot.data())

	if (item == null) {
		console.error(`There is no ${typeof new Tconstructor()} in firebase store.`)
		return null
	}

	if(modelIdentifierName) {
		Object.defineProperty(item, modelIdentifierName, {writable: true, value: snapshot.id})
	}

	return item as T
}
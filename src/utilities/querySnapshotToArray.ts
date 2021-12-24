import {DocumentData, QueryDocumentSnapshot, QuerySnapshot} from "firebase/firestore";

export default function querySnapshotToArray<T>(snapshot: QuerySnapshot<DocumentData>, modelIdentifierName: string) {
	const returnArr: T[] = [];

	snapshot.forEach(function (doc: QueryDocumentSnapshot<DocumentData>) {
		const item = doc.data();
		item[modelIdentifierName] = doc.id;

		returnArr.push(item as T);
	});

	return returnArr;
}
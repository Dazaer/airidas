import {DataSnapshot} from "firebase/database";

export default function snapshotToArray<T>(snapshot: DataSnapshot, uniqueIdentifierName: string) {
	const returnArr: T[] = [];

	snapshot.forEach(function (childSnapshot) {
		const item = childSnapshot.val();
		item[uniqueIdentifierName] = childSnapshot.key;

		returnArr.push(item);
	});

	return returnArr;
}
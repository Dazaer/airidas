import {DataSnapshot} from "firebase/database";
/**
 * Used for transforming a list that is gotten from firebase database into the corresponding typescript model array.
 * @param snapshot Firebase snapshot from onValue function
 * @param modelIdentifierName The model's unique identifier name. For example 'id' or 'key'. Whatever the model uses.
 * @returns An array of models of T type.
 */
export default function snapshotToArray<T>(snapshot: DataSnapshot, modelIdentifierName: string) {
	const returnArr: T[] = [];

	snapshot.forEach(function (childSnapshot) {
		const item = childSnapshot.val();
		item[modelIdentifierName] = childSnapshot.key;

		returnArr.push(item);
	});

	return returnArr;
}
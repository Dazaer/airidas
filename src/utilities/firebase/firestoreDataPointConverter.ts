import Priority from "@/models/Priority";
import {collection, getFirestore, QueryDocumentSnapshot} from "firebase/firestore";
//https://medium.com/swlh/using-firestore-with-typescript-65bd2a602945
/**
 * Currently not being used. Is this something that could be useful?
 */

	const firestore = getFirestore();

	const converter = <T>() => ({
		toFirestore: (data: T) => data,
		fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as T
	})
	
	const dataPoint = <T>(collectionPath: string) => collection(firestore, collectionPath).withConverter(converter<T>())

	const firestoreConverter = {
		priorities: dataPoint<Priority>('priorities'),
		priority: (priorityId: string) => dataPoint<Priority>(`priorities/${priorityId}`)
	}
	
	export { firestoreConverter }
	export default firestoreConverter
import {getFirestore, QueryDocumentSnapshot} from "firebase/firestore";

const db = getFirestore();

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as T
})

//const dataPoint = <T>(collectionPath: string) => db.collection(collectionPath).withConverter(converter<T>())
//https://medium.com/swlh/using-firestore-with-typescript-65bd2a602945
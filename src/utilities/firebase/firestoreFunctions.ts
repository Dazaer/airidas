import { CollectionReference, DocumentReference, getDocs, limit, query, QueryConstraint, QueryDocumentSnapshot, startAfter, UpdateData, updateDoc } from "firebase/firestore";

export class CollectionFieldUpdateModel<T> {
	public collectionRef!: CollectionReference<T>
	public fieldName!: Exclude<keyof T, number | symbol>
	public defaultFieldValue!:any // T[typeof this.fieldName]

	constructor(collectionRef: CollectionReference<T>, fieldName: Exclude<keyof T, number | symbol>, defaultFieldValue: T[typeof fieldName]) {
		this.collectionRef = collectionRef
		this.fieldName = fieldName
		this.defaultFieldValue = defaultFieldValue
	}
}

type SuccessUpdateDocPromiseResult<T> = {
	success: boolean;
	ref: DocumentReference<T>;
}

type ErrorUpdateDocPromiseResult<T> = {
	success: boolean;
	ref: DocumentReference<T>;
	error: any;
}

export async function addDefaultValueForFieldInCollection<T>(model: CollectionFieldUpdateModel<T>, pageSize:number = 100) {
	let checkedCount = 0
	let pageCount = 1;
  const initFieldPromises:Promise<SuccessUpdateDocPromiseResult<T> | ErrorUpdateDocPromiseResult<T>>[] = []
	const newData:UpdateData<T> = { [model.fieldName]: model.defaultFieldValue } as UpdateData<T>

  // get first page of results
  console.log(`Fetching page ${pageCount}...`);

	const initialConstraints: QueryConstraint[] = [limit(pageSize)]
	const dbQuery = query(model.collectionRef, ...initialConstraints)
	let querySnapshot = await getDocs(dbQuery)

  // while page has data, parse documents
  while (!querySnapshot.empty) {
    // for fetching the next page -- Set the first one as default
    let lastSnapshot: QueryDocumentSnapshot<T> = querySnapshot.docs[0];

    // for each document in this page, add the field as needed
    querySnapshot.forEach(doc => {
      if (doc.get(model.fieldName) === undefined) {
				const addFieldPromise = updateDoc(doc.ref, newData)
          .then(
            () => ({ success: true, ref: doc.ref }),
            (error) => ({ success: false, ref: doc.ref, error }) // trap errors for later analysis
          );

        initFieldPromises.push(addFieldPromise);
      }

      lastSnapshot = doc;
    });

    checkedCount += querySnapshot.size;
    pageCount++;

    // fetch next page of results
    console.log(`Fetching page ${pageCount}... (${checkedCount} documents checked so far, ${initFieldPromises.length} need initialization)`);
		const newConstraints: QueryConstraint[] = [limit(pageSize), startAfter(lastSnapshot)]
		const newDbQuery = query(model.collectionRef, ...newConstraints)

    querySnapshot = await getDocs(newDbQuery)
  }

  console.log(`Finished searching documents. Waiting for writes to complete...`);

  // wait for all writes to resolve
  const initFieldResults = await Promise.all(initFieldPromises);

  console.log(`Finished`);

  // count & sort results
  let initializedCount = 0
	const errored: ErrorUpdateDocPromiseResult<T>[] = [];
  initFieldResults.forEach((res) => {
    if (res.success) {
      initializedCount++;
    } else {
      errored.push(res as ErrorUpdateDocPromiseResult<T>);
    }
  });

  const results: any = {
    attemptedCount:<number> initFieldResults.length,
    checkedCount,
    errored,
    erroredCount: errored.length,
    initializedCount
  };

  console.log([
    `From ${results.checkedCount} documents, ${results.attemptedCount} needed the "${model.fieldName}" field added.`,
    results.attemptedCount == 0
      ? ""
      : ` ${results.initializedCount} were successfully updated and ${results.erroredCount} failed.`
  ].join(""));

  const errorCountByCode = errored.reduce((counters: any, result: any) => {
    const code = result.error.code || "unknown";
    counters[code] = (counters[code] || 0) + 1;
    return counters;
  }, {});
  console.log("Errors by reported code:", errorCountByCode);

  return results;
}
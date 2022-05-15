import { ProjectConfig } from "./../../../project.config"
import {initializeApp} from "firebase/app"

/*
import { getAnalytics } from "firebase/analytics";
*/

const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY_PROD,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID_PROD,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN_PROD,
	databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL_PROD,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET_PROD,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID_PROD,
	appId: process.env.VUE_APP_FIREBASE_APP_ID_PROD,
	measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID_PROD
}


const devFirebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY_DEV,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID_DEV,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN_DEV,
	//databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL_DEV,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET_DEV,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID_DEV,
	appId: process.env.VUE_APP_FIREBASE_APP_ID_DEV,
	//measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID_DEV
}

const firebaseApp = initializeApp(ProjectConfig.isProductionEnv ? firebaseConfig : devFirebaseConfig)

export default firebaseApp

/*
//const analytics = getAnalytics(firebaseApp);
firebase.initializeApp(firebaseConfig)
export default firebase;
*/
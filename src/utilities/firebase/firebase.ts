import { ProjectConfig, ProjectEnvironments } from "./../../../project.config"
import {FirebaseOptions, initializeApp} from "firebase/app"

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

const previewFirebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY_PREVIEW,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID_PREVIEW,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN_PREVIEW,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET_PREVIEW,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID_PREVIEW,
	appId: process.env.VUE_APP_FIREBASE_APP_ID_PREVIEW,
	measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID_PREVIEW
}

function getEnvironmentConfig(currentEnvironment: ProjectEnvironments): FirebaseOptions {
	switch (currentEnvironment) {
		case ProjectEnvironments.Production: {
			return firebaseConfig;
		}
		case ProjectEnvironments.Development: {
			return devFirebaseConfig;
		}
		case ProjectEnvironments.Preview: {
			return previewFirebaseConfig;
		}
		default:
			return devFirebaseConfig;
	}
}

const firebaseApp = initializeApp(getEnvironmentConfig(ProjectConfig.currentEnvironment))

export default firebaseApp

/*
//const analytics = getAnalytics(firebaseApp);
firebase.initializeApp(firebaseConfig)
export default firebase;
*/
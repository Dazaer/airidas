import {initializeApp} from "firebase/app"

const firebaseConfig = {
  apiKey: "",
  projectId: "",
  authDomain: "",
	databaseURL: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
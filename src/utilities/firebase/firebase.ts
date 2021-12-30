import {initializeApp} from "firebase/app"

/*
import { getAnalytics } from "firebase/analytics";
import firebaseAuth from "firebase/auth";
*/

const firebaseConfig = {
  apiKey: "AIzaSyA4HGqgYL5V-r9gcCIIupKY8O7KJK2ueHE",
  projectId: "airidas-site",
  authDomain: "airidas-site.firebaseapp.com",
	databaseURL: "https://airidas-site-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "airidas-site.appspot.com",
  messagingSenderId: "895343697389",
  appId: "1:895343697389:web:d38524bb1cf7ba5fb19be4",
  measurementId: "G-20P448HHLG"
};

const devFirebaseConfig = {
  apiKey: "AIzaSyAxTiw5Fuo2OMeivlrqJ9mA5VDNYA4FMwY",
  projectId: "airidas-site-dev",
  authDomain: "airidas-site-dev.firebaseapp.com",
	//databaseURL: "https://airidas-site-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "airidas-site-dev.appspot.com",
  messagingSenderId: "332466504796",
  appId: "1:332466504796:web:0ac1b47acba09dfb969299",
  //measurementId: "G-20P448HHLG"
};


const firebaseApp = initializeApp(firebaseConfig);
//const firebaseApp = initializeApp(devFirebaseConfig);

export default firebaseApp;

/*
//const analytics = getAnalytics(firebaseApp);
firebase.initializeApp(firebaseConfig)
export default firebase;
*/
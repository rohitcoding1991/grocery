import firebase from '@react-native-firebase/app';
import db from '@react-native-firebase/database';
import au from '@react-native-firebase/auth';
import store from '@react-native-firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDApTC_EX4FreFC5FMyCtxlM1JWwmKwwiM",
    authDomain: "mrchicken-1ad22.firebaseapp.com",
    databaseURL: "https://mrchicken-1ad22.firebaseio.com",
    projectId: "mrchicken-1ad22",
    storageBucket: "mrchicken-1ad22.appspot.com",
    messagingSenderId: "653503830188",
    appId: "1:653503830188:web:f70585089f9006e35d2709",
    measurementId: "G-FG0LQHBNHJ"
};
// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const f = firebase;
export const database = db();
export const auth = au();
export const storage = store();

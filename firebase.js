import firebase from 'firebase';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAaHmVa0R2ecRzQHmh-XtAJzPP5m8iLHLA',
  authDomain: 'facebook-build-83822.firebaseapp.com',
  projectId: 'facebook-build-83822',
  storageBucket: 'facebook-build-83822.appspot.com',
  messagingSenderId: '124016586062',
  appId: '1:124016586062:web:1fa80fe10123d07704421f',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const storage = firebase.storage();

export { db, storage };

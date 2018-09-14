import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDiXWYthHVwhqoRXZu-QfJ3Umz90fFw7hs",
    authDomain: "geobase-social-network-70eae.firebaseapp.com",
    databaseURL: "https://geobase-social-network-70eae.firebaseio.com",
    projectId: "geobase-social-network-70eae",
    storageBucket: "geobase-social-network-70eae.appspot.com",
    messagingSenderId: "998087487182"
}

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots:true
}
firestore.settings(settings);

export default firebase;


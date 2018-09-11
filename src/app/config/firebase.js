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

// import firebase from 'firebase';
// import 'firebase/firestore';
//
// const firebaseConfig = {
//     apiKey: "AIzaSyAUNBjilavH2T3H4WsM319-CnKkhA4pcco",
//     authDomain: "revents-31284.firebaseapp.com",
//     databaseURL: "https://revents-31284.firebaseio.com",
//     projectId: "revents-31284",
//     storageBucket: "revents-31284.appspot.com",
//     messagingSenderId: "189195857891"
// }
//
// firebase.initializeApp(firebaseConfig);
// firebase.firestore();
//
// export default firebase;
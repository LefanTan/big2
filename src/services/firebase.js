// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-analytics.js"></script>

// <script>
//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   var firebaseConfig = {
//     apiKey: "AIzaSyA__laCqzqZe3MmI3_TC_F1ywdMvo4vprg",
//     authDomain: "big2-4e418.firebaseapp.com",
//     projectId: "big2-4e418",
//     storageBucket: "big2-4e418.appspot.com",
//     messagingSenderId: "1014909594305",
//     appId: "1:1014909594305:web:b10ee15f534c95eb6f8240",
//     measurementId: "G-PMYKH1SK0L"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
// </script>

import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA__laCqzqZe3MmI3_TC_F1ywdMvo4vprg",
    authDomain: "big2-4e418.firebaseapp.com",
    databaseURL: "https://big2-4e418.firebaseio.app"
  };
firebase.initializeApp(config); 
export const auth = firebase.auth;
export const db = firebase.database();
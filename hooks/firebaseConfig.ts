/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Our Firebase Config
// const firebaseConfig = {
//   apiKey: 'AIzaSyD_2YNx0Qlrieu0ds1SqMtiFUYOAu875oc',
//   authDomain: 'drive-app-expo.firebaseapp.com',
//   projectId: 'drive-app-expo',
//   storageBucket: 'drive-app-expo.appspot.com',
//   messagingSenderId: '933572512945',
//   appId: '1:933572512945:web:50b65189db3391067e2690',
//   measurementId: 'G-L71LVMGF88',
// };

// ////////////////////////////////////////////////////////////////

// Qadeel Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyCLXOfZUrNXK1PhD7mOHYTycFWitBtxqAg',
  authDomain: 'whippybois-483df.firebaseapp.com',
  projectId: 'whippybois-483df',
  storageBucket: 'whippybois-483df.appspot.com',
  messagingSenderId: '269010315997',
  appId: '1:269010315997:web:4cdaa39fa1e4c4b8a88934',
  measurementId: 'G-73WRBXLY9S',
};

///////////////////////////////////////////////////////////////////
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export {auth};

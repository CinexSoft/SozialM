import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

// firebase init
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FirebaseConfig = {
    apiKey: 'AIzaSyBeOE11fAnnEQTimqK8VClhlWMzyOu3ob8',
    authDomain: 'sozialnmedien.firebaseapp.com',
    databaseURL: 'https://sozialnmedien-default-rtdb.firebaseio.com',
    projectId: 'sozialnmedien',
    storageBucket: 'sozialnmedien.appspot.com',
    messagingSenderId: '584583202268',
    appId: '1:584583202268:web:60e4997e7a59138bdfbb19',
    measurementId: 'G-MFG92Y4C4F',
};

// if hosted on localhost, use FB emulator for database on port 9000
if (location.href.includes('localhost')) FirebaseConfig.databaseURL = 'http://localhost:9000?ns=sozialnmedien';

// Initialize Firebase
export const App = initializeApp(FirebaseConfig);
export const Database = getDatabase(App);
export const Auth = getAuth(App);

export const RTDB_USERS_ROOT = '/ba14fdd95c0d857ed647a819d80b0a1a343f053994be559be2a4324d513135ed/users';
export const RTDB_SLOGS_ROOT = '/66d6cc8921d26daea31bc60f0545c97f1c34b8426237822239c9e456d1cc9a26/slogs';
export const RTDB_CHATS_ROOT = '/5e47119018a91ea0994c1ab82275f9e465886edabf5ec7b09e9e8e4cf5c7253d/chats';

console.log('Log: firebaseinit.js loaded');

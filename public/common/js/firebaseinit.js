import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

// firebase init
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: 'AIzaSyBeOE11fAnnEQTimqK8VClhlWMzyOu3ob8',
    authDomain: 'sozialnmedien.firebaseapp.com',
    databaseURL: 'https://sozialnmedien-default-rtdb.firebaseio.com',
    projectId: 'sozialnmedien',
    storageBucket: 'sozialnmedien.appspot.com',
    messagingSenderId: '584583202268',
    appId: '1:584583202268:web:60e4997e7a59138bdfbb19',
    measurementId: 'G-MFG92Y4C4F',
};

// Initialize Firebase
export const App = initializeApp(firebaseConfig);
export const Analytics = getAnalytics(app);
export const Database = getDatabase();
export const Auth = getAuth();

// database root
export const DBROOT = '/Ci4j82hg96y36rfi96vfrwog7h85f4jh870bpgw52fekftt95hjo7d2i3jgie64k';
console.log('Log: firebase initialised');

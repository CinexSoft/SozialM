import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

// firebase init
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FirebaseConfig = {
    apiKey: 'AIzaSyBeOE11fAnnEQTimqK8VClhlWMzyOu3ob8',
    authDomain: 'sozialm.firebaseapp.com',
    databaseURL: 'https://sozialm-default-rtdb.firebaseio.com',
    projectId: 'sozialm',
    storageBucket: 'sozialm.appspot.com',
    messagingSenderId: '584583202268',
    appId: '1:584583202268:web:60e4997e7a59138bdfbb19',
    measurementId: 'G-MFG92Y4C4F',
};

// If hosted on localhost, use database at localhost
if (/localhost|127\.0.\.0\.1/i.test(location.href)) FirebaseConfig.databaseURL = 'http://localhost:9000/?ns=sozialm';

// Initialize Firebase
export const App = initializeApp(FirebaseConfig);
export const Database = getDatabase(App);
export const Auth = getAuth(App);

/* Seperates roots for preview and production databases.
 * This code checks if the URL is the production URL and accordingly sets the
 * database root.
 * Production URLs are sozialm.web.app and sozialm.firebaseapp.com
 */
const ROOT = (!/sozialm\.web\.app|sozialm\.firebaseapp\.com/i.test(location.href) ? '/preview' : '/production');

export const RTDB_USERS_ROOT = ROOT + '/aa14fdd9-users';
export const RTDB_SLOGS_ROOT = ROOT + '/b6d6cc89-slogs';
export const RTDB_CHATS_ROOT = ROOT + '/ce471190-chats';

console.log('module firebaseinit.js loaded');

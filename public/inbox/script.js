import { Auth, Database } from '../common/js/firebaseinit.js';
import { ref, update } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { log, err, $, checkForApkUpdates } from '../common/js/modules.js';

checkForApkUpdates();

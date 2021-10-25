import { ref, update } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { $, } from '/common/js/domfunc.js';
import { Auth, Database } from '/common/js/firebaseinit.js';
import { checkForApkUpdates, } from '/common/js/generalfunc.js';
import { log, err, } from '/common/js/logging.js';

log('site /settings loaded');

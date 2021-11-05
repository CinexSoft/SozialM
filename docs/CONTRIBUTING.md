## Index
1. [Introduction](#1-introduction)
2. [Directory structure](#2-directory-structure)
3. [Deployment channels](#3-deployment-channels)
4. [Workflow automation]()
5. [Deployment process]()
6. 

## 1. Introduction

## 2. Directory structure
<pre style="
    width: calc(100% - 10px);
    padding: 5px;
    overflow: auto; ">
<a href="../#">Repo Root</a>
    &#9500; <a href="../.github/">.github</a>
    &#9474;    &#9500; <a href="../.github/ISSUE_TEMPLATE/">ISSUE_TEMPLATE</a>
    &#9474;    &#9474;    &#9500; <a href="../.github/ISSUE_TEMPLATE/bug_report.md">bug_report.md</a>
    &#9474;    &#9474;    &#9500; <a href="../.github/ISSUE_TEMPLATE/custom.md">custom.md</a>
    &#9474;    &#9474;    &#9492; <a href="../.github/ISSUE_TEMPLATE/feature_request.md">feature_request.md</a>
    &#9474;    &#9492; <a href="../.github/workflows/">workflows</a>
    &#9474;         &#9500; <a href="../.github/workflows/Obfuscate%20JS%20and%20Deploy%20to%20Firebase.yml">Obfuscate JS and Deploy to Firebase.yml</a>
    &#9474;         &#9492; <a href="../.github/workflows/Obfuscate%20JS%20and%20Deploy%20to%20Preview.yml">Obfuscate JS and Deploy to Preview.yml</a>
    &#9500; <a href="../development/">development</a>
    &#9474;    &#9500; <a href="../development/public/">public</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/auth/">auth</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/auth/index.html">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/auth/script.js">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/auth/styles.css">styles.css</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/common/">common</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/css/">css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/css/colors.css">colors.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/css/common.css">common.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/css/keyframes.css">keyframes.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/css/markdown.css">markdown.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/css/mediaqueries.css">mediaqueries.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/common/css/overlays.css">overlays.css</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/">js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/colors.js">colors.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/domfunc.js">domfunc.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/firebaseinit.js">firebaseinit.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/generalfunc.js">generalfunc.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/init.js">init.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/logging.js">logging.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/common/js/overlays.js">overlays.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/common/js/variables.js">variables.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/common/res/">res</a>
    &#9474;    &#9474;    &#9474;         &#9500; <a href="../development/public/common/res/backarrow100white.png">backarrow100white.png</a>
    &#9474;    &#9474;    &#9474;         &#9500; <a href="../development/public/common/res/defaultdp.png">defaultdp.png</a>
    &#9474;    &#9474;    &#9474;         &#9492; <a href="../development/public/common/res/whatsappbg.png">whatsappbg.png</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/downloads/">downloads</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/downloads/app.web.sozialm.apk">app.web.sozialm.apk</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/downloads/app.web.sozialm.localhost.apk">app.web.sozialm.localhost.apk</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/messaging/">messaging</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/messaging/chat/">chat</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/messaging/chat/index.html">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/messaging/chat/script.js">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/messaging/chat/styles.css">styles.css</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/messaging/inbox/">inbox</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/messaging/inbox/index.html">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/messaging/inbox/script.js">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/messaging/inbox/styles.css">styles.css</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/messaging/script.js">script.js</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/profile/">profile</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/profile/index.html">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/profile/script.js">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/profile/styles.css">styles.css</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/records/">records</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/records/currentapkversion">currentapkversion</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/settings/">settings</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/settings/index.html">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="../development/public/settings/script.js">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="../development/public/settings/styles.css">styles.css</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/404.html">404.html</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/a2hs.webmanifest">a2hs.webmanifest</a>
    &#9474;    &#9474;    &#9500; <a href="../development/public/favicon.ico">favicon.ico</a>
    &#9474;    &#9474;    &#9492; <a href="../development/public/index.html">index.html</a>
    &#9474;    &#9500; <a href="../development/.firebaserc">.firebaserc</a>
    &#9474;    &#9500; <a href="../development/database.rules.json">database.rules.json</a>
    &#9474;    &#9492; <a href="../development/firebase.json">firebase.json</a>
    &#9500; <a href="../docs/">docs</a>
    &#9474;    &#9500; <a href="../docs/CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a>
    &#9474;    &#9492; <a href="../docs/CONTRIBUTING.md">CONTRIBUTING.md</a>
    &#9500; <a href="../preview/">preview</a>
    &#9474;    &#9500; <a href="../preview/.firebaserc">.firebaserc</a>
    &#9474;    &#9500; <a href="../preview/database.rules.json">database.rules.json</a>
    &#9474;    &#9500; <a href="../preview/firebase.json">firebase.json</a>
    &#9474;    &#9492; <a href="../preview/preview.build.list">preview.build.list</a>
    &#9500; <a href="../production/">production</a>
    &#9474;    &#9500; <a href="../production/.firebaserc">.firebaserc</a>
    &#9474;    &#9500; <a href="../production/database.rules.json">database.rules.json</a>
    &#9474;    &#9492; <a href="../production/firebase.json">firebase.json</a>
    &#9500; <a href="../.gitignore">.gitignore</a>
    &#9500; <a href="../LICENSE.txt">LICENSE.txt</a>
    &#9492; <a href="../README.md">README.md</a>
</pre>

## 3. Deployment channels

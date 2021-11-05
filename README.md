# SozialM
A shot at a social media platform. Front-end only.

## Hosting
- Firebase is used for hosting and database.
- Project is hosted at [https://sozialm.web.app](https://sozialm.web.app).
- Webview based APK [release](https://github.com/CinexSoft/SozialMApk/releases/tag/v2021.10.30.19.25)

## Contribute
- Please go through [CONTRIBUTING.md](docs/CONTRIBUTING.md).
- During code review, if your code is found to deviate too far from the rules mentioned, your code won't be merged.

## Directory structure
<pre style="
    width: calc(100% - 10px);
    padding: 5px;
    overflow: auto; ">
<a href="#">Repo Root</a>
    &#9500; <a href="#">.github</a>
    &#9474;    &#9500; <a href="#">ISSUE_TEMPLATE</a>
    &#9474;    &#9474;    &#9500; <a href="#">bug_report.md</a>
    &#9474;    &#9474;    &#9500; <a href="#">custom.md</a>
    &#9474;    &#9474;    &#9492; <a href="#">feature_request.md</a>
    &#9474;    &#9492; <a href="#">workflows</a>
    &#9474;         &#9500; <a href="#">Obfuscate JS and Deploy to Firebase.yml</a>
    &#9474;         &#9492; <a href="#">Obfuscate JS and Deploy to Preview.yml</a>
    &#9500; <a href="#">development</a>
    &#9474;    &#9500; <a href="#">public</a>
    &#9474;    &#9474;    &#9500; <a href="#">auth</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">styles.js</a>
    &#9474;    &#9474;    &#9500; <a href="#">common</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">colors.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">common.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">keyfeames.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">markdown.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">mediaqueries.css</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">overlays.css</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">colors.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">domfunc.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">firebaseinit.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">generalfunc.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">init.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">logging.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">overlays.js</a>
    &#9474;    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">variables.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">res</a>
    &#9474;    &#9474;    &#9474;         &#9500; <a href="#">backarrow100white.png</a>
    &#9474;    &#9474;    &#9474;         &#9500; <a href="#">defaultdp.png</a>
    &#9474;    &#9474;    &#9474;         &#9492; <a href="#">whatsappbg.png</a>
    &#9474;    &#9474;    &#9500; <a href="#">downloads</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">app.web.sozialm.apk</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">app.web.sozialm.localhost.apk</a>
    &#9474;    &#9474;    &#9500; <a href="#">messaging</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">chat</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">inbox</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">script.js</a>
    &#9474;    &#9474;    &#9500; <a href="#">profile</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">styles.js</a>
    &#9474;    &#9474;    &#9500; <a href="#">records</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">currentapkversion</a>
    &#9474;    &#9474;    &#9500; <a href="#">settings</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">index.html</a>
    &#9474;    &#9474;    &#9474;    &#9500; <a href="#">script.js</a>
    &#9474;    &#9474;    &#9474;    &#9492; <a href="#">styles.js</a>
    &#9474;    &#9474;    &#9500; <a href="#">404.html</a>
    &#9474;    &#9474;    &#9500; <a href="#">a2hs.webmanifest</a>
    &#9474;    &#9474;    &#9500; <a href="#">favicon.ico</a>
    &#9474;    &#9474;    &#9492; <a href="#">index.html</a>
    &#9474;    &#9500; <a href="#">.firebaserc</a>
    &#9474;    &#9500; <a href="#">database.rules.json</a>
    &#9474;    &#9492; <a href="#">firebase.json</a>
    &#9500; <a href="#">docs</a>
    &#9474;    &#9500; <a href="#">CODE_OF_CONDUCT.md</a>
    &#9474;    &#9492; <a href="#">CONTRIBUTING.md</a>
    &#9500; <a href="#">preview</a>
    &#9474;    &#9500; <a href="#">.firebaserc</a>
    &#9474;    &#9500; <a href="#">database.rules.json</a>
    &#9474;    &#9500; <a href="#">firebase.json</a>
    &#9474;    &#9492; <a href="#">preview.build.list</a>
    &#9500; <a href="#">production</a>
    &#9474;    &#9500; <a href="#">.firebaserc</a>
    &#9474;    &#9500; <a href="#">database.rules.json</a>
    &#9474;    &#9492; <a href="#">firebase.json</a>
    &#9500; <a href="#">.gitignore</a>
    &#9500; <a href="#">LICENSE.txt</a>
    &#9492; <a href="#">README.md</a>
</pre>

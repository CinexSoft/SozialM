# SocialMediaPlatform
A shot at a social media platform

## WARNINGS

### No 1
Please do not activate the code obfuscator workflow.
It's very difficult to maintain branches with the obfuscator
running on the main branch on every push.
<br><br>
It also makes code big and slow.

<!--
### No 1
Do NOT make changes directly to `MAIN` or `PUBLISH`.
Create a seperate branch named after you from `PUBLISH`
for youself.

### No 2
DO NOT MERGE `MAIN` INTO `PUBLISH` or any other branch.
Otherwise all javascript codes will be obfuscated
(made un-readable and un-debuggable) and lost.

- NOTE that javascript codes in `MAIN` are obfuscated automatically.

```
  DO    [main]    ← [publish]
  DON'T [publish] ← [main]
```

### No 3
Do NOT delete `PUBLISH` after merging it into `MAIN`.

- NOTE that `PUBLISH` contains code that is healthy, working
and un-obfuscated.

### No 4
Try NOT to merge `PUBLISH` into other branches.
To update your branch, delete your branch and
re-branch it from `PUBLISH`.

### No 5
No branch other than `PUBLISH` should be MERGED to `MAIN`
```
  DO    [main] ← [publish]
  DON'T [main] ← [others]
```

### No 6
Every other branch, once ready, should be merged to `PUBLISH`,
tested, and then merged to `MAIN`.
-->

## Deployment
- Firebase hosting and database
- Project is hosted at [https://sozialnmedien.web.app](https://sozialnmedien.web.app)
- Hosting rules at `firebase.json`
- Webpage root at `public/`
- Webview based APK [download](https://sozialnmedien.web.app/downloads/chat.app.web.sozialnmedien.apk)

## Contributing
- Follow `Airbnb` JavaScript style guide - [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript).
- Please don't hardcode.
- Important functions can be found in `public/common/js/common.js`.
- Important styles can be found in `public/common/css/common.css`.
- Keep `HTML`, `CSS` and `JavaScript` files seperate for faster page loading.
- All `events` should have identifier `e` or `event`.
- All errors and exceptions should have identifier `error`.
- Avoid using single alphabet identifiers.

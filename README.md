# SocialMediaPlatform
A shot at a social media platform

## WARNINGS

### No 0
This `README` says exactly what you should do. `READ` it `WHOLE` before you start contributing and do as it says.
Otherwise, we all will `SUFFER`.

### No 1
Do NOT make changes directly to `MAIN`.
Create a seperate branch `named after you` from `MAIN` for youself.

### No 2
Please do not activate the code obfuscator workflow.
It's very difficult to maintain branches with the obfuscator
running on the main branch on every push.
<br><br>
It also makes code big and slow.

## Deployment
- Firebase hosting and database
- Project is hosted at [https://sozialnmedien.web.app](https://sozialnmedien.web.app)
- Hosting rules at `firebase.json`
- Webpage root at `public/`
- Webview based APK [release](https://github.com/CinexSoft/SozialnMedienApk/releases/tag/v2021.09.15.14.50)

## Style Guide
- Follow `Airbnb` style guide for JavaScript - [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript).
- `Our style` override `Airbnb` style.

## Our style
### Identifier format
- Avoid using single alphabet identifiers.
- Global variables: `FOO` or `FOO_BAR`.
- Local variables: `foo` or `foo_bar`.
- Class and objects: `Foo` or `FooBar`.
- Functions: `foo()` or `fooBar()` or `fooBarFoo()`.
- All `events` should have identifier `e` or `event`.
- All `errors` and exceptions should have identifier `error`.

### Rules
- Please don't hardcode.
- Important styles can be found in `public/common/css/`.
- Important modules can be found in `public/common/js/modules.js`.
- All colors used can be found in `public/common/css/colors.css` and `public/common/js/modules.js`.
- Keep `HTML`, `CSS` and `JavaScript` files seperate for faster page loading.
- Only include those CSS files or JS modules that you'll need.
- Keep your code as flat as possible. Avoid nested structures wherever possible.
- Use `const` over `let` wherever possible. This way a variable will be defined only once and you won't need to track any changes made to it.
- Document functions well if it'll stay in `public/common/js/modules.js`.
- Take time to refractor your code and document it before pushing.
- To make code more readable through refractoring, you might need to tweak the logic of your code. Do it.

### Logging
- Use logger functions `log`, `err` and `wrn` from `public/common/js/modules.js`.
- To display the logs on screen, put `setVariable('DEBUG', true);` in `public/common/js/common.js` right below the imports.
- These functions dump the logs in the database, allowing easy debugging.
- You may use `console.log`, `console.error` and `console.warn` only if you can't import `public/common/js/modules.js` or you don't want to upload the logs as they contain sensitive information.

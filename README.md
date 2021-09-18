# SocialMediaPlatform
A shot at a social media platform.

Front-end only.

## WARNINGS

### No 0
This `README` says exactly what you should do. `READ` it `WHOLE` before you start contributing and do as it says.
Otherwise, we all will `SUFFER`.

### No 1
Do NOT make changes directly to `MAIN`.
Create a seperate branch `named after you` from `MAIN` for youself.

Test you code using the Firebase emulator before pushing it.

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
- RTDb security rules at `database.rules.json`.
- Webpage root at `public/`
- Webview based APK [release](https://github.com/CinexSoft/SozialnMedienApk/releases/tag/v2021.09.15.14.50)

## Style Guide
- Follow `Airbnb` style guide for JavaScript - [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript).
- `Our style` overrides `Airbnb` style.

## Our style
### Identifiers
- Avoid using single alphabet identifiers.
- Global variables: `FOO` or `FOO_BAR`.
- Local variables: `foo` or `foo_bar`.
- Local `const` non-Objects: `FOO` or `FOO_BAR`.
- Class and objects: `Foo` or `FooBar`.
- Functions: `foo()` or `fooBar()`.
- All `events` should have identifier `e` or `event`. Try to go with `event`.
- For `events`, you may do `event_[type]` or `event_[target_id]`.
- All `errors` and exceptions should have identifier `error`.
- For `errors`, you may do `error_[name]`.

### Rules
- Please don't hardcode.
- Important styles can be found in `public/common/css/`.
- Important modules can be found in `public/common/js/modules.js`.
- All colors used can be found in `public/common/css/colors.css` and `public/common/js/modules.js`.
- Keep `HTML`, `CSS` and `JavaScript` files seperate for faster page loading.
- JavaScript code should be kept modular.
- Only link (or import) those CSS files (or JS modules) that you'll need.
- `CSS`, `res` and `JS` must be linked via absolute path.
- Keep your code as flat as possible. Avoid nested structures wherever possible.
- Use `const` over `let` wherever possible. This way a variable will be defined only once and you won't need to track any changes made to it.
- Don't use numbers in expressions all of a sudden. Explain their purpose by either commenting or by representing them with an identifier.
- Document functions well if they'll stay in `public/common/js/modules.js`.
- Function docs (when provided) must contain `@param` (for all parameters), `@return` and `@throws` (whichever applicable).
- Variable docs must contain `@type`.
- Take time to refractor your code and document it before pushing.
- Make code more readable through refractoring.
- If you need to tweak the logic of your code for that, do it.

### Logging
- Use logger functions `log`, `err` and `wrn` from `public/common/js/modules.js`.
- To display the logs on screen, uncomment `setVariable('DEBUG', true);` in `public/common/js/common.js` right below the imports.
- These functions dump the logs in the database, allowing easy debugging.
- You may use `console.log`, `console.error` and `console.warn` only if you can't import `public/common/js/modules.js` or you don't want to upload the logs as they contain sensitive information.

## WARNINGS

### No 0
`READ` this `WHOLE` before you start contributing and do as it says.
Otherwise, we all will `SUFFER`.

### No 1
Do NOT make changes directly to `MAIN`.
Create a seperate branch `named after you` from `MAIN` for youself.

Test your code using the Firebase emulator before pushing it.

## 1. Deployment
1. Directory `production/` aliased the `[PRODUCTION CHANNEL]` is auto-maintained.
2. Do NOT touch the `[PRODUCTION CHANNEL]`.
3. Make changes to directory `development/`, aliased the `[DEV CHANNEL]`. 
4. Once pushed or merged to `MAIN`, JavaScript is obfuscated to the `[PRODUCTION CHANNEL]` and automatically deployed.
5. To test the site, use `firebase emulators:start` in the `[DEV CHANNEL]`.
6. Do NOT run `firebase deploy` in the `[DEV CHANNEL]`.
7. If done, `firebase deploy` will be made to crash.
8. `WARN` others when making changes to the `obfuscator workflow`.

## 2. Rules

### 2a. File structure
- Keep `CSS` and `JavaScript` for non-root `HTML` seperate for faster loading.
- `CSS`, `res` and `JS` must be linked via absolute path.
- Try not to have `HTML` files in `root`.
- All `HTML` files should be named `index.html`.
- `HTML` for seperate sites should be kept in seperate directories.

### 2b. Documentation
1. Document functions well if they'll stay in `public/common/js/`.
2. Variable docs must contain `@type`.

### 2c. Refractoring
1. Take time to refractor and document your code before pushing.
2. Make code more readable through refractoring.
3. If you need to tweak the logic of your code for that, do it.
4. Keep your code as flat as possible.
5. Avoid nested structures wherever possible.
6. Use `const` over `let` wherever possible.
7. This way you won't need to track further changes made to it.
8. Don't use numbers in expressions all of a sudden.
9. Explain their purpose by commenting or using a proper identifier.

### 2d. Git
From `2021/09/23`, all `git commits` will have the following format:
```
[file or dir]: [function (if any)]: [issue or pr (if any)]: [context]: [absolute path (optional)]
[content (if any)]
```

Example 1:
```
CONTRIBUTING.md: updated rules: /docs/CONTRIBUTING.md

- Properly categorised rules.
- Added new rules.
```

Example 2:
```
chats/script.js: issue #6 Fixed - <div> not scaling back up on <img> longpress

- Set LONG_PRESSED_ELEMENT to the parent bubble on longpress start.
- LONG_PRESSED_ELEMENT -> scale(1) on event pointerup.
```

- To do so, run `git commit`.
- When the text editor opens up, type in the commit.
- Save it and close the editor.

## 3. Style Guide
- Follow `Airbnb` style guide for JavaScript - [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript).
- Points present in `Our style` overrides those of `Airbnb` style.

## 4. Our style

### 4a. Identifiers
Beyond loops, avoid using single alphabet identifiers.

Global variables:
```
let FOO = value;
let FOO_BAR = value;
```

Local variables:
```
let foo = value;
let foo_bar = value;
```

Local non-Objects constants:
```
const FOO = value;
const FOO_BAR = value;
```

Objects:
```
let Foo = {
    // object properties
}
let FooBar = {
    // object properties
}
```

Functions:
```
let fooBar = (param) => {
    // function definition
}
```

Events:
```
// more preferred
element.addEventListener((event) => {
    // event handler
}

// less preferred
element.addEventListener((e) => {
    // event handler
}
```

Errors:
```
try {
    // code
}
catch (error) {
    // error handler
}

some function().then(() => {
    // code
}).catch((error) => {
    // error handler
});
```

### 4b. Indentation
1. Intent using `4 spaces`.
2. Do NOT use `tabs`.

### 4c. Code
1. Please don't hardcode.
2. Important styles: `/public/common/css/`.
3. Important colors: `/public/common/css/colors.css`.
4. Important module: `/public/common/js/modules.js`.
5. `Dialogs` and `menus`: `/public/common/js/overlays.js`.
6. Instead of re-using hexes in CSS, use `var(--color-name)`.
7. For JS, import `Color` from `/public/common/js/modules.js`.

### 4d. Logging and debugging
1. Use `log`, `err` and `wrn` from `public/common/js/modules.js`.
2. To display on screen, uncomment `setVariable('DEBUG', true);` in `public/common/js/common.js`.
3. These functions dump the logs in the database, allowing easy debugging.
4. You may use `console.log`, `console.error` and `console.warn` only if you can't import `public/common/js/modules.js` or you don't want to upload the logs.

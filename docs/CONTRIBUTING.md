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
1. Keep `CSS` and `JavaScript` for non-root `HTML` seperate for faster loading.
2. `CSS`, `res` and `JS` must be linked via absolute path.
3. Try not to have `HTML` files in `root`.
4. All `HTML` files should be named `index.html`.
5. `HTML` for seperate sites should be kept in seperate directories.

### 2b. Files at common
File root at [repo/development/public/common](/development/public/common/).

**Stylesheets**
1. [/common/css/colors.css](/development/public/common/css/colors.css): All accent colors defined by hexes.
2. [/common/css/common.css](/development/public/common/css/common.css): Styles for general HTML tags.
3. [/common/css/keyframes.css](/development/public/common/css/keyframes.css): Keyframe definitions.
4. [/common/css/markdown.css](/development/public/common/css/markdown.css): Styles for all HTML elements derived from markdown.
5. [/common/css/overlays.css](/development/public/common/css/overlays.css): Styles for all overlays.

**JavaScript**

### 2c. Application concepts and terms

**Crucial CSS files**
1. [/common/css/colors.css](/development/public/common/css/colors.css)
2. [/common/css/common.css](/development/public/common/css/common.css)

**Crucial JS modules**
1. 

**Markdown**
1. Markdown is converted to HTML using some library.
2. We use [showdownjs/showdown](https://github.com/showdownjs/showdown).
3. To apply styles in `Section 2b -> Stylesheets -> 4`, the HTML needs to be put inside a container.
4. The HTML container element must have the class name `markdown`. Generally we use a `div`.
5. Don't forget to link [/common/css/markdown.css](/development/public/common/css/markdown.css) to the HTML document.

**Overlays - Splashcreens, Dialogs and Menus**
1. Overlay types: `Dialogs` and `Menus`.
2. `Menus`: Dialog with `1 heading`, `no content`, and `buttons` arranged in 1 column. Can be dismissed by tapping outside.
3. `Dialog/Menu content`: HTML content present inside the `content` class of a dialog.
4. `Dialogs`: 2 types - `alert` and `action`.
5. `Alert Dialog`: Dialog with `1 heading`, `content`, and `1 customizable button`. Cannot be dismissed like `Menus`.
6. `Action Dialog`: Dialog with `1 heading`, `content`, and `2 buttons`. `Right button is customizable`, left dismisses dialog. Can be dismissed like `Menus`.

### 2d. Documentation
1. Document functions well if they'll stay in `public/common/js/`.
2. Variable docs must contain `@type`.

### 2e. Refractoring
1. Take time to refractor and document your code before pushing.
2. Make code more readable through refractoring.
3. If you need to tweak the logic of your code for that, do it.
4. Keep your code as flat as possible.
5. Avoid nested structures wherever possible.
6. Use `const` over `let` wherever possible.
7. This way you won't need to track further changes made to it.
8. Don't use numbers in expressions all of a sudden.
9. Explain their purpose by commenting or using a proper identifier.

### 2f. Git
From `2021/09/23`, all `git commits` will have the following format:
```
[issue fix (if any)]: short (1 line) summary
[content (if any) with short modification summary (for multiple files, with absolute file paths, root at repo or repo/development/public)]

Alternative to providing modification summary, you can comment the modded lines in GitHub diff view
```

Example 1:
```
Updated rules:

- Properly categorised rules.
- Added new rules.
```

Example 2:
```
Issue #6 Fixed - <div> not scaling back up on <img> longpress

- Updated /chat/script.js
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
```javascript
let FOO = value;
let FOO_BAR = value;
```

Local variables:
```javascript
let foo = value;
let foo_bar = value;
```

Local non-Objects constants:
```javascript
const FOO = value;
const FOO_BAR = value;
```

Objects:
```javascript
let Foo = {
    // object properties
}
let FooBar = {
    // object properties
}
```

Functions:
```javascript
let fooBar = (param) => {
    // function definition
}
```

Events:
```javascript
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
```javascript
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
4. Important functions: `/public/common/js/`.
5. `Dialogs` and `menus`: `/public/common/js/overlays.js`.
6. Instead of re-using hexes in CSS, use `var(--color-name)`.
7. For JS, import `Color` from `/public/common/js/colors.js`.

### 4d. Logging and debugging
1. Use `log`, `err` and `wrn` from `public/common/js/logging.js`.
2. To display on screen, uncomment `setVariable('DEBUG', true);` in `public/common/js/common.js`.
3. These functions dump the logs in the database, allowing easy debugging.
4. You may use `console.log`, `console.error` and `console.warn` only if you can't import `public/common/js/modules.js` or you don't want to upload the logs.

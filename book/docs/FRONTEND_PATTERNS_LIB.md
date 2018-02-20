# Techs / libs utilizadas, por que e exemplo.
  * Eslint
  * EditorConfig (espaço em vez de tabs, etc...)
  * Jest para testes
  * Husky
  * React Router (?)
  * Redux
  * Ramda
  * Recompose

## Eslint

### Por quê?
  * Clear consistence code across teams.
  * Configurable rules.
  * Ability to write your own plug-ins and rules.

### Como ?

  You have to create a file .eslinrc and define your rules.

```
{
  extends: ["taller/react"],
  globals: {
    __DEV__: false,
    __MOCK_GRAPHQL__: false,
    drupalSettings: false,
    xdescribe: false,
    xit: false
  },
  rules: {
    no-mixed-operators: 0,
    import/first: 0,
    prefer-promise-reject-errors: 0
  }
}
```

## EditorConfig

* Spaces over tabs (2 spaces).

## Jest

### Por quê?

* All dependencies are mocked by default.
* Easy setup and configuration.
* Auto-magically finds and runs all your tests; no registration required.

**References:**
* http://andrew.codes/jest-vs-mocha-why-jest-wins/

### Como ?

```
{
  ...
  scripts: {
    ...
    "test:unit": "./node_modules/jest/bin/jest.js",
    "test:unit:watch": "yarn test:unit -- --watch"
  },

  ...

  "jest": {
    "setupFiles": [
      "raf/polyfill",
      "<rootDir>/enzyme.setup.js"
    ],
    "collectCoverage": true,
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/.next",
      "<rootDir>/temp"
    ],
    "moduleNameMapper": {
      "modernizr": "<rootDir>/mocks/modernizr.js"
    }
  }
}
```

## Husky

### Por quê?

### Como ?


## React Router (?)

### Por quê?

### Como ?


## Redux

### Por quê?

### Como ?


## Ramda

### Por quê?

### Como ?


## Recompose

### Por quê?

### Como ?

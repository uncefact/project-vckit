[![CircleCI](https://circleci.com/gh/Open-Attestation/decentralized-renderer-react-template.svg?style=svg)](https://circleci.com/gh/Open-Attestation/decentralized-renderer-react-template)

# React Template

React boilerplate to write decentralize renderer.

## Install

The easiest way to use **decentralized-renderer-react-template** is through github by clicking on `Use this template` button in the repository page.

You can also download or `git clone` this repo

```sh
$ git clone https://github.com/Open-Attestation/decentralized-renderer-react-template.git my-module
$ cd my-module
$ rm -rf .git
$ npm install
```

Make sure to edit the following files according to your module's info:

- package.json (module name and version)
- README.md
- LICENSE
- add your own template (in `src/templates` folder) and configure correctly the template registry (in `src/templates/index.tsx` file)

## Commands

```sh
$ npm run storybook # open storybook and start editing your components
$ npm run storybook:build # generate docs
$ npm run test:watch # run tests with Jest
$ npm run test:coverage # run tests with coverage
$ npm run integration # run integration test with testcafe
$ npm run lint # lint code
$ npm run build # build component
$ npm run example:application # start embedded application
```

## Code organization and development

- `index.ts` contains the logic to communicate with the host embedding your renderer. You probably will _never_ need to update that file.
- template registry configuration is located in `src/templates/index.tsx`
- templates are located in `src/templates` folder. You can add as many template as you want and structure the code the way you want
- documents samples contains fake data to test the templates you build. You can create a typescript interface to make sure that your template uses the correct expected document
  - create a type describing the kind of document you expect to render (for instance check `CustomTemplateCertificate` in `src/sample.tsx`)
  - create a template consuming that interface, using the `TemplateProps` helper from `@govtechsg/decentralized-renderer-react-components (for instance check the template in`src/templates/customTemplate/customTemplate.tsx`)
- shared components are located in `src/core` folder. For instance you can find a watermark example that will be displayed when printing the document
- examples of how to add a watermark and qr code are located in `examples/template`
- feel free to remove whatever you dont need

## Testing the templates in an integrated environment

This template provides a simple application that is able to render documents built for the current renderer. To use it:

1. Open `application/index.tsx` file and edit the `documents` property of the `App` component to suit your needs (provide any document that is available locally, whether it's a javascript, JSON or typescript document).
1. Start your renderer: `npm run dev`
1. Start the local application: `npm run example:application`
1. Head to `http://localhost:3010/`, you should see the configured documents during step 1.

## Testing the templates in vanilla HTML

1. Start your renderer: `npm run dev`
1. Start the local HTML: `npm run example:html`
1. Head to `http://localhost:8080/`, you should see a button to render document and hit it.

## End-to-end and visualisation test

This repository has been configured to run end-to-end tests using `Testcafe`. Visualisation testing is also configured through `Percy` and tests are ran through `Testcafe`.

To setup `Percy`, you will need a token that you can find on Percy's dashboard:

- For local development, type `export PERCY_TOKEN=<PERCY_TOKEN>` before running `npm run integration`.
- For [**CircleCI**](https://docs.percy.io/docs/circleci), add an environment variable `PERCY_TOKEN` with the token value.

## Features

- [**React**](http://reactjs.org/) - A JavaScript library for building user interfaces.
- [**Webpack**](https://webpack.js.org/) - Component bundler.
- [**React testing library**](https://testing-library.com/) - Simple and complete testing utilities that encourage good testing practices.
- [**Emotion**](https://emotion.sh/) - Library designed for writing css styles with JavaScript.
- [**Babel**](https://babeljs.io/) - Write next generation JavaScript today.
- [**Jest**](https://facebook.github.io/jest) - JavaScript testing framework used by Facebook.
- [**Testcafe**](https://devexpress.github.io/testcafe/) - A node.js tool to automate end-to-end web testing.
- [**Percy**](http://percy.io/) - Visualisation testing tool.
- [**ESLint**](http://eslint.org/) - Make sure you are writing a quality code.
- [**Prettier**](https://prettier.io/) - Enforces a consistent style by parsing your code and re-printing it.
- [**Typescript**](https://www.typescriptlang.org/) - JavaScript superset, providing optional static typing
- [**Circle CI**](https://circleci.com/) - Automate tests and linting for every push or pull request.
- [**Storybook**](https://storybook.js.org/) - Tool for developing UI components in isolation with documentation.
- [**Debug**](https://github.com/visionmedia/debug) - JS debugging utility that works both in node.js and browsers.

## Changing stuff

### Removing Emotion

- Uninstall npm packages

```sh
$ npm uninstall @emotion/core @emotion/styled @emotion/babel-preset-css-prop
```

- Remove `@emotion/babel-preset-css-prop` from Babel presets (configuration is made in package.json file)
- Remove `@emotion/core` from Typescript configuration (in tsconfig.json file)
- Remove `.storybook/webpack.config.js` (file created only for emotion css property support in storybook)

### Removing Examples

- Uninstall npm packages

```sh
$ npm uninstall qrcode.react @types/qrcode.react
```

- Remove `examples` folder completely
- Remove line 5 with `../example` context from `.storybook/config.js` (so that storybook won't look for example files)

## License

GPL-3.0

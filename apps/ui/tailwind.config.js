// https://tailwindcss.com/docs/configuration/#referencing-in-javascript
// https://stackoverflow.com/questions/44114436/the-create-react-app-imports-restriction-outside-of-src-directory

const config = require("./src/tailwind.js"); // workaround for react to resolve tailwind config, by accessing inside of src directory

module.exports = config;
